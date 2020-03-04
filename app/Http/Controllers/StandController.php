<?php

namespace App\Http\Controllers;

use App\Stand;
use Illuminate\Http\Request;

class StandController extends Controller
{
    public function random()
    {
        return response()->json(Stand::with('Products')->inRandomOrder()->take(3)->get(),200);
    }
   
    public function index()
    {
        return response()->json(
            Stand::with([
                'Products'
            ])
            ->latest()
            ->get(),200);
    }

    
    public function store(Request $request)
    {
        $stand = Stand::create([
            'stand_name' => $request->stand_name,
            'description' => $request->description,
            
                       
        ]);

        return response()->json([
            'status' => (bool) $stand,
            'data'   => $stand,
            'message' => $stand ? 'Stand Created!' : 'Error Creating Stand'
        ]);
    }

    
    public function show(Stand $stand)
    {
        
        return response()-> json(Stand::with('Products')->where('id', '=', $stand->id)->first(),200);                
    }

    public function update(Request $request, Stand $stand)
    {
        $status = $stand->update(
            $request->only(['stand_name', 'description'])
        );

        return response()->json([
            'status' => $status,
            'message' => $status ? 'Stand Updated!' : 'Error Updating Stand'
        ]);
    }


    
    public function destroy(Stand $stand)
    {
        $status = $stand->delete();

            return response()->json([
                'status' => $status,
                'message' => $status ? 'Stand Deleted!' : 'Error Deleting Stand'
            ]);
    }
}
