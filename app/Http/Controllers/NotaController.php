<?php

namespace App\Http\Controllers;

use App\Nota;
use App\Order;
use App\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class NotaController extends Controller
{

   
    public function index()
    {
        return response()->json(Nota::with(['Order', 'Order.Product:id,name'])->get(),200);
    }

   
    public function store(Request $request)
    {
        $nota = null;

        DB::transaction(function () use ($request, &$nota) {
            //Creating a new transaction
            $nota = Nota::create([
                'harga_total' => $request->input('harga_total'),
                'user_id' => $request->input('user_id')
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
        }, 3);

        return response()->json([
            'status' => (bool) $nota,
            'nota_id'   => $nota ? $nota->id : null,
            'message' => $nota ? 'Nota Created!' : 'Error Creating Nota'
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
