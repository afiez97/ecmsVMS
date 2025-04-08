<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use App\Models\mis_prm_locations;

class mis_prm_locationsController extends Controller
{
    public function register(Request $request){
        $clg_id = $request->input('clg_id');
        $loc_name = $request->input('loc_name');
        $loc_description = $request->input('loc_description');
        $loc_type = $request->input('loc_type');
        $loc_capacity = $request->input('loc_capacity');
        $loc_status = $request->input('loc_status');
        $recordstatus = $request->input('recordstatus');

        $obj = mis_prm_locations::create([
            'clg_id' => $clg_id,
            'loc_name' => $loc_name,
            'loc_description' => $loc_description,
            'loc_type' => $loc_type,
            'loc_capacity' => $loc_capacity,
            'loc_status' => $loc_status,
            'recordstatus' => $recordstatus,
        ]);

        if ($obj){
            return response()->json([
                'success'=>'true',
                'message'=>'Register Success!',
                'data'=>$obj
            ],201);
        }
        else{
            return response()->json([
                'success'=>'false',
                'message'=>'Bad Request',
                'data'=>$obj
            ],400);
        }
    }


    public function show($id){
        $obj = mis_prm_locations::where('loc_id',$id) ->first();

        if ($obj){
            return response()->json([
                'success'=>'true',
                'message'=>'Show Success!',
                'data'=>$obj
            ],200);
        }
    }

    public function list()  {
        $mis_prm_locations = mis_prm_locations::join('mis_prm_college', 'mis_prm_college.pk_id', '=' , 'mis_prm_locations.clg_id') -> where([['mis_prm_locations.recordstatus','!=','DEL']]) -> get();

        if ($mis_prm_locations)   {
            return response()->json([
                'success'=>'true',
                'message'=>'List Success!',
                'data'=>$mis_prm_locations
            ],200);
        }
        
    }


    public function update(Request $request){
        $loc_id = $request->input('loc_id');
        $loc_name = $request->input('loc_name');
        $loc_description = $request->input('loc_description');
        $loc_type = $request->input('loc_type');
        $loc_capacity = $request->input('loc_capacity');
        $loc_status = $request->input('loc_status');
        $recordstatus = $request->input('recordstatus');

        $obj = mis_prm_locations::where([['loc_id','=',$loc_id]]) -> update([
            'loc_name' => $loc_name,
            'loc_description' => $loc_description,
            'loc_type' => $loc_type,
            'loc_capacity' => $loc_capacity,
            'loc_status' => $loc_status,
            'recordstatus' => $recordstatus,
        ]);

        if ($obj)  {
            return response()->json([
                'success'=>true,
                'message'=>"Update Success!",
                'data' => $obj
            ],200);
        }
        else{
            return response()->json([
                'success'=>false,
                'message'=>"Update Failed!",
                'data'=>''
            ],404);
        }
    }


    public function delete(Request $request)    {
        $id = $request->input('loc_id');
        $recordstatus = $request->input('recordstatus');

        $obj = mis_prm_locations::where([['loc_id','=',$id]])-> update([
            'recordstatus' => $recordstatus,
        ]);

        if ($obj)  {
            return response()->json([
                'success'=>true,
                'message'=>"Hapus Berjaya!",
                'data' => $obj
            ],200);
        }
        else{
            return response()->json([
                'success'=>false,
                'message'=>"Hapus Gagal!",
                'data'=>''
            ],401);
        }
    }


    public function listByCampus($id)  {
        $obj = mis_prm_locations::SELECT('mis_prm_locations.*','clg_name')
            -> join('mis_prm_college', 'mis_prm_college.pk_id', '=' , 'mis_prm_locations.clg_id')
            -> where('mis_prm_locations.clg_id', '=', $id)
            -> where([['mis_prm_locations.recordstatus','!=','DEL']]) -> get();

        if (sizeof($obj) > 0)   {
            return response()->json([
                'success'=>true,
                'message'=>'List Success!',
                'data'=>$obj
            ],200);
        }
        else{
            return response()->json([
                'success'=>false,
                'message'=>'List Fail!',
                'data'=>''
            ],400);
        }
    }


    // list location by Campus & Active
    public function listByCamAct($id){
        $obj = mis_prm_locations::where([
                ['clg_id', '=', $id],
                ['loc_status','Active'],
                ['recordstatus','!=','DEL']
            ])
            ->get([
                'loc_id',
                'loc_name',
                'loc_type',
            ]);

            if (sizeof($obj) > 0)   {
                return response()->json([
                    'success'=>true,
                    'message'=>'List Success!',
                    'data'=>$obj
                ],200);
            }
            else{
                return response()->json([
                    'success'=>false,
                    'message'=>'List Fail!',
                    'data'=>''
                ],400);
            }
    }
}
