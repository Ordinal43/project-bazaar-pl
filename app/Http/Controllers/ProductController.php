<?php

namespace App\Http\Controllers;

use App\Product;
use Illuminate\Http\Request;
use Illuminate\Database\Eloquent\SoftDeletes;

class ProductController extends Controller
{
   
    
    public function random()
    {
        return response()->json(Product::inRandomOrder()->take(3)->get(),200);
    }

    public function allProduct(){
        return response()->json(Product::select('id','name','is_available','image','price','stand_id')
        ->with([
            'Stand:id,stand_name'
            ])->get(),200);
    }

    public function index()
    {
        return response()->json(Product::all(), 200);
    }

    /**
     * Save a new product to storage.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request)
    {
        $product = Product::create([
            'name' => $request->name,
            'description' => $request->description,
            'is_available' => true,
            'price' => $request->price,
            'image' => $this->uploadImage($request),
            'stand_id' => $request->stand_id
        ]);

        return response()->json([
            'status' => (bool) $product,
            'data'   => $product,
            'message' => $product ? 'Product Created!' : 'Error Creating Product'
        ]);
    }

    /**
     * Handle an image upload.
     *
     * @param Request $request
     * @param null $name
     * @return string
     */
    public function uploadImage(Request $request, $name = null)
    {
        if($request->hasFile('image')){
            $image = $request->file('image');

            if (is_null($name)) {
                $name = time() . "_" . rand(1000, 1000000) . "." . $image->getClientOriginalExtension();
            }

            $image->move(public_path('images'), $name);

            return '/images/'.$name;
        }

        return '';
    }

    public function show(Product $product)
    {
        return response()-> json($product,200);
    }


    public function update(Request $request, $product)
    {

        $status = Product::find($product);
        $status->name = $request['name'];
        $status->description = $request['description'];
        $status->is_available = $request['is_available'];
        $status->price = $request['price'];
        $status->stand_id = $request['stand_id'];
        if($request->hasFile('image')){
            $status->image= $this->uploadImage($request);
        }
        $status->update();

        return response()->json([
            'status' => $status,
            'message' => $status ? 'Product Updated!' : 'Error Updating Product'
        ], 200);
    }

    /**
     * Remove a product from storage.
     *
     * @param Product $product
     * @return \Illuminate\Http\JsonResponse
     * @throws \Exception
     */
    public function destroy(Product $product)
    {
        $status = $product->delete();

        return response()->json([
            'status' => $status,
            'message' => $status ? 'Product Deleted!' : 'Error Deleting Product'
        ], 200);
    }
}
