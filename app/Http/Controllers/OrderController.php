<?php

namespace App\Http\Controllers;
use App\Product;
use App\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class OrderController extends Controller
{
   
    public function indexTrue(Request $request)
    {
        if ($request->has('stand')) {
            return response()->json(
                Order::with([
                    'Nota:id,customer',
                    'Product'=> function($query) use ($request) {
                        $query->where('stand_id', '=', $request->input('stand'));
                        $query->select('id', 'name');
                        $query->withTrashed();   
                    }
                ])
                ->where('is_ready', '=', true)
                ->get()
            );
        }

        return response()->json(Order::with(['Nota:id,customer', 'Product:id,name'])->get(),200);
    }


    public function indexFalse(Request $request)
    {
        if ($request->has('stand')) {
            return response()->json(
                Order::with([
                    'Nota:id,customer',
                    'Product'=> function($query) use ($request) {
                        $query->where('stand_id', '=', $request->input('stand'));
                        $query->select('id', 'name');
                        $query->withTrashed();   
                    }
                ])->where('is_ready', '=', false)->get()
            );
        }

        return response()->json(Order::with(['Nota:id,customer', 'Product:id,name'])->get(),200);
    }

    public function indexNull(Request $request)
    {
        if ($request->has('stand')) {
            return response()->json(
                Order::with([
                    'Nota:id,customer',
                    'Product'=> function($query) use ($request) {
                        $query->where('stand_id', '=', $request->input('stand'));
                        $query->select('id', 'name');
                        $query->withTrashed();   
                    }
                ])->where('is_ready', '=', null)->get()
            );
        }

        return response()->json(Order::with(['Nota:id,customer', 'Product:id,name'])->get(),200);
    }

    public function all()
    {
        return response()->json(Order::with([
            'Nota' => function($query)
            {
                $query->select('id','customer');
            },
            'Product'=> function($query){
                $query->withTrashed();
            },
            'Product.Stand'=>function($query){
                $query->withTrashed();
                $query->select('id', 'stand_name');
            }
            ])->orderBy('id','DESC')->get(),200);
    }

    public function allTrue()
    {
        return response()->json(Order::with([
            'Nota' => function($query)
            {
                $query->select('id','customer');
            },
            'Product'=> function($query){
                $query->withTrashed();
            },
            'Product.Stand'=>function($query){
                $query->withTrashed();
                $query->select('id', 'stand_name');
            }
            ])->where('is_ready', true)->orderBy('id','DESC')->get(),200);
    }

    public function allFalse()
    {
        return response()->json(Order::with([
            'Nota' => function($query)
            {
                $query->select('id','customer');
            },
            'Product'=> function($query){
                $query->withTrashed();
            },
            'Product.Stand'=>function($query){
                $query->withTrashed();
                $query->select('id', 'stand_name');
            }
            ])->where('is_ready', false)->orderBy('id','DESC')->get(),200);
    }

    public function allNull()
    {
        return response()->json(Order::with([
            'Nota' => function($query)
            {
                $query->select('id','customer');
            },
            'Product'=> function($query){
                $query->withTrashed();
            },
            'Product.Stand'=>function($query){
                $query->withTrashed();
                $query->select('id', 'stand_name');
            }
            ])->where('is_ready', null)->orderBy('id','DESC')->get(),200);
    }

    
    public function store(Request $request)
    {
        $order = Order::create([
            'product_id' => $request->product_id,
            'quantity' => $request->quantity,
            'harga_satuan' => $request->harga_satuan,
            'nota_id' => $request->nota_id,
        ]);

        return response()->json([
            'status' => (bool) $order,
            'data'   => $order,
            'message' => $order ? 'Order Created!' : 'Error Creating Order'
        ]);
    }

    
    public function show(Order $order)
    {
        return response()->json($order,200);
    }

   
    public function update(Request $request, Order $order)
    {
        $status = $order->update(
            $request->only(['product_id','quantity','harga_satuan', 'nota_id'])
        );

        return response()->json([
            'status' => $status,
            'message' => $status ? 'Order Updated!' : 'Error Updating Order'
        ]);
    }

    public function canceled(Order $order){
        $order->is_ready = false;
        $status = $order->save();
        return response()->json([
            'status' => $status,
            'message' => $status ? 'Order Canceled' : 'Error Canceling Order'
        ]);
    }

    public function ready(Order $order){

         DB::transaction(function () use ($order, &$status) {            
            $product = Product::find($order['product_id']);
            $product->units -= $order['quantity'];
            $product->save();
            $order->is_ready = true;
            $status = $order->save();        
    }, 3);

        return response()->json([
            'status' =>(bool) $status,
            'message' => $status ? 'Order is ready' : 'Error'
        ]);
    }
    public function destroy(Order $order)
    {

         $status = DB::transaction(function () use ($order) {
            
                $product = Product::find($order['product_id']);
                $product->units += $order['quantity'];
                $product->save();
                $order->delete();
            
        }, 3);

        return response()->json([
            'status' => (bool)$status,
            'message' => $status ? 'Order Deleted!' : 'Error Deleting Order'
        ]);
    }
}
