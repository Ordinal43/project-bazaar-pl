<?php

namespace App\Http\Controllers;

use App\Voucher;
use App\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class VoucherController extends Controller
{
    
    public function index()
    {
        return response()->json(Voucher::latest()->get(),200);
    }

    public function indexUnredeemed(){
        return response()->json(Voucher::where('is_redeem', '=', false)->latest()->get(),200);
    }

    public function indexRedeemed(){
        return response()->json(Voucher::where('is_redeem','=', true)->latest()->get(),200);
    }

    public function store(Request $request)
    {
        $voucher = Voucher::create([
            // 'redeem_by'=>$request->redeem_by,
            'nominal'=>$request->nominal,
            'qrcode'=>$this->generateQr(),
        ]);

        return response()->json([
            'status'=>(bool) $voucher,
            'data'=>$voucher,
            'message'=>$voucher ? 'Voucher Created':'Failed create new voucher'
        ]);
    }

    public function generateQr(){
        return md5(uniqid(rand(),true));
    }

    public function redeem(Request $request){
        if($request->has('qrcode')){
            $status = Voucher::where('qrcode','=', $request->input('qrcode'))->first();
            if(!$status){
                return response()->json([
                    'status' => false,
                    'message'=>'Kode voucher tidak valid!'
                ]);
            }else{
                $check = $status->where('qrcode','=', $request->input('qrcode'))->where('is_redeem',true)->first();
                if($check){
                    return response()->json([
                        'status' => false,
                        'message'=>'Kode voucher sudah diambil'
                    ]);
                }
                else{
                    $userid = $request->input('user_id');
                    $status = Voucher::where('qrcode','=', $request->input('qrcode'));
                    $process= DB::transaction(function () use ($status, &$userid){
                        $redeem = $status->update(['is_redeem'=> true , 'user_id'=> $userid ]);

                        // Adding Credit For User

                        $user = User::find($userid);
                        $user->balance += $status->value('nominal');
                        $user->save();
                        return true;
                    }, 3);
                    return response()->json([
                        'status' =>$process,
                        'message'=>$process ? 'Redeem Success' : 'Error Redeem QR'
                    ]);
                }

            }
        }
        return response()->json('Scan Please...');
    }
   
    public function show(Voucher $voucher)
    {
        //
    }

    
    public function update(Request $request, Voucher $voucher)
    {
        //
    }

    public function destroy(Voucher $voucher)
    {
        //
    }
}
