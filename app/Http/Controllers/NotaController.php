<?php

namespace App\Http\Controllers;

use App\Nota;
use App\Order;
use App\Product;
use App\User;
use App\Stand;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class NotaController extends Controller
{
    public function generateQr(){
        return md5(uniqid(rand(),true));
    }
   
    public function index()
    {
        return response()->json(Nota::with([
           'Order', 'Order.Product.Stand:id,stand_name'
            ])
            ->get(),200);
    }

    public function notaByStand(Request $request, $stand)
    {
        return response()->json(Nota::with([
           'Order', 'Order.Product.Stand:id,stand_name'
            ])
            ->where('stand_id',$stand)
            ->get(),200);
    }

    public function notaByUser(Request $request, $user)
    {
        return response()->json(Nota::with([
           'Order', 'Order.Product.Stand:id,stand_name'
            ])
            ->where('user_id',$user)
            ->get(),200);
    }

    public function paid(Request $request){
        if($request->has('qrcode')){
            $status = Nota::where('qrcode', '=', $request->input('qrcode'))->first();
            if(!$status){
                return response()->json([
                    'status' => false,
                    'message' => 'Nota tidak valid!'
                ]);
            }else{
                $check = $status->where('qrcode','=', $request->input('qrcode'))->where('is_paid',true)->first();
                if($check){
                    return response()->json([
                        'status' => false,
                        'message' => 'Nota sudah dibayar'
                    ]);
                }
                else{
                    $userid = $request->input('user_id');
                    $status = Nota::where('qrcode', '=', $request->input('qrcode'));
                    $process = DB::transaction(function () use ($status){
                        $paid = $status->update(['is_paid'=>true]);
                        //Adding Balance to Stand
                        $stand = Stand::find($status->value('stand_id'));
                        $user = User::find($stand->value('user_id'));
                        $user->balance += $status->value('harga_total');
                        $user->save();
                        return true;
                    },3);
                    return response()->json([
                        'status' =>$process,
                        'message' => $process ? 'Success' : 'Error' 
                    ]);
                }
            }
        }
        return response()->json('Scan Please...');
    }
   
    public function store(Request $request)
    {
        $nota = null;

        DB::transaction(function () use ($request, &$nota) {
            //Creating a new transaction
            $nota = Nota::create([
                'harga_total' => $request->input('harga_total'),
                'user_id' => $request->input('user_id'),
                'stand_id' => $request->input('stand_id'),
                'qrcode' => $this->generateQr(),
            ]);

            //Creating order details
            foreach ($request->input('products') as $detail) {
                Order::create([
                    'product_id' => $detail['product_id'],
                    'harga_satuan' => $detail['harga_satuan'],
                    'quantity' => $detail['quantity'],
                    'nota_id' => $nota->id
                ]);
            }
            //Get Saldo
            $user = User::find($nota['user_id']);
            $user->balance -= $nota['harga_total'];
            $user->save(); 
        }, 3);

        return response()->json([
            'status' => (bool) $nota,
            'nota_id'   => $nota ? $nota->id : null,
            'message' => $nota ? 'Nota Created!' : 'Error Creating Nota'
        ]);
    }

    public function cancel(Nota $nota){
        if($nota['is_cancel'] = true){
            return response()->json([
                'status' => 'Failed',
                'message' => 'Nota sudah dicancel'
            ]);            
        }
        $status = DB::transaction (function () use ($nota){
            $nota->is_cancel = true;
            $save = $nota->save();
            $user = User::find($nota['user_id']);
            $user->balance += $nota['harga_total'];
            $user->save();
            return true;
        },3);
        return response()->json([
            'status' => $status,
            'message' => $status ? 'Succsess' : 'Failed'
        ]);
    }

  
    public function show(Nota $nota)
    {
        return response()->json(
            $nota::with([
                'Order',
                'Order.Product.Stand:id,stand_name',                           
                ])
        ->where('id', '=', $nota->id)->first());
    }

   
    public function update(Request $request, Nota $nota)
    {
        $status = $nota->update(
            $request->only([ 'harga_total'])
        );

        return response()->json([
            'status' => $status,
            'message' => $status ? 'Nota Updated!' : 'Error Updating Nota'
        ]);
    }

  
    public function destroy(Nota $nota)
    {
        $status = $nota->delete();

        return response()->json([
            'status' => $status,
            'message' => $status ? 'Nota Deleted!' : 'Error Deleting Nota'
        ]);
    }
}
