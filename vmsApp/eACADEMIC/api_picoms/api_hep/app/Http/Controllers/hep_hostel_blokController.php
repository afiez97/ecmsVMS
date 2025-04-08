<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use App\Models\hep_hostel_blok;
use Illuminate\Support\Facades\DB;

class hep_hostel_blokController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }
    
    public function register(Request $request) {
        $hostel_id = $request->input('hostel_id');
        $block_name = $request->input('block_name');
        $block_status = $request->input('block_status');
        $block_remark = $request->input('block_remark');
        $block_gender = $request->input('block_gender');
        $recordstatus = $request->input('recordstatus');

        $obj = hep_hostel_blok::create([
            'hostel_id' => $hostel_id,
            'block_name' => $block_name,
            'block_status' => $block_status,
            'block_remark' => $block_remark,
            'block_gender' => $block_gender,
            'recordstatus' => $recordstatus
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
        $obj = hep_hostel_blok::where('block_id',$id)->first();

        if ($obj){
            return response()->json([
                'success'=>'true',
                'message'=>'Show Success!',
                'data'=>$obj
            ],200);
        }
    }


    public function list($id){
        $obj = hep_hostel_blok::where([['hep_hostel_blok.hostel_id','=',$id],['hep_hostel_blok.recordstatus','!=','DEL']]) 
            ->leftjoin('hep_hostel', 'hep_hostel.hostel_id','=','hep_hostel_blok.hostel_id')
            ->leftjoin('mis_prm_college', 'mis_prm_college.pk_id','=','hep_hostel.hostel_branch')
            ->get([
                'block_id',
                'hep_hostel_blok.hostel_id AS blokHstl',
                'hostel_name',
                'hostel_branch',
                'clg_name',
                'block_name',
                'block_status',
                'block_gender',
                'block_remark'
            ]);

        if ($obj){
            return response()->json([
                'success'=>'true',
                'message'=>'List Success!',
                'data'=>$obj
            ],200);
        }
    }


    public function update(Request $request){
        $block_id = $request->input('block_id');
        $block_name = $request->input('block_name');
        $block_status = $request->input('block_status');
        $block_remark = $request->input('block_remark');
        $block_gender = $request->input('block_gender');
        $recordstatus = $request->input('recordstatus');

        $obj = hep_hostel_blok::where([['block_id','=',$block_id]]) ->update([
            'block_name' => $block_name,
            'block_status' => $block_status,
            'block_remark' => $block_remark,
            'block_gender' => $block_gender,
            'recordstatus' => $recordstatus
        ]);

        if ($obj){
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


    public function delete(Request $request){
        $recordstatus = $request->input('recordstatus');
        $block_id = $request->input('block_id');

        $obj = hep_hostel_blok::where('block_id',$block_id)-> update([
            'recordstatus' => $recordstatus,
        ]);

        if ($obj){
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


    public function listByHostel($id){
        $obj = hep_hostel_blok::SELECT('hep_hostel_blok.*')
            ->where([
                ['hostel_id','=',$id],
                ['block_status','=','Active'],
                ['recordstatus','!=','DEL']
            ]) -> get();

        if ($obj){
            return response()->json([
                'success'=>'true',
                'message'=>'List Success!',
                'data'=>$obj
            ],200);
        }
    }


    // list block by Hostel & Gender
    public function listByHstlGndr(Request $request){
        $hostel_id = $request->input('hostel_id');
        $block_gender = $request->input('block_gender');

        $obj = hep_hostel_blok::where([
                ['hostel_id','=',$hostel_id],
                ['block_gender','=',$block_gender],
                ['block_status','=','Active'],
                ['recordstatus','!=','DEL']
            ]) 
            ->get(['block_id','block_name']);


            // add on coding sni klau add issue tutup bawah nie je
            $blocksWithData = [];

            foreach ($obj as $block) {
                $obj2 = DB::table('hep_hostel_room as h1')
                    ->select('h1.room_id', 'h1.room_no', 'h1.total_bed', DB::raw('CONVERT(COALESCE(k.total_occupied, 0), UNSIGNED) AS total_occupied'))
                    ->leftJoinSub(function ($query) {
                        $query->select('h2.room_id', DB::raw('SUM(CASE WHEN h2.checkIn_status IS NOT NULL THEN 1 ELSE 0 END) AS total_occupied'))
                            ->from('hep_hostel_chkinout as h2')
                            ->where('h2.checkIn_status', '!=', 'Check Out')
                            ->where('h2.recordstatus', '!=', 'DEL')
                            ->groupBy('h2.room_id');
                    }, 'k', 'h1.room_id', '=', 'k.room_id')
                    ->where('h1.block_id', $block->block_id)
                    ->where('h1.recordstatus', '!=', 'DEL')
                    ->where('h1.room_status', 'Active')
                    ->whereRaw('h1.total_bed > COALESCE(k.total_occupied, 0)')
                    ->get();
            
                // If $obj2 has data, add the block to $blocksWithData array
                if (!$obj2->isEmpty()) {
                    $blocksWithData[] = $block;
                }
            }

            
            // end add on coding sni

        if($obj){
            return response()->json([
                'success'=>'true',
                'message'=>'List Success!',
                // 'data'=>$obj
                'data'=>$blocksWithData
            ],200);
        }
    }
}
