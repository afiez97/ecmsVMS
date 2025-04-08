<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use App\Models\hep_hostel_bed;

class hep_hostel_bedController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }
    
    public function register(Request $request) {
        $hostel_id = $request->input('hostel_id');
        $block_id = $request->input('block_id');
        $room_id = $request->input('room_id');
        $bed_no = $request->input('bed_no');
        $bed_occupied = $request->input('bed_occupied');
        $bed_status = $request->input('bed_status');
        $bed_remark = $request->input('bed_remark');
        $recordstatus = $request->input('recordstatus');

        $obj = hep_hostel_bed::create([
            'hostel_id' => $hostel_id,
            'block_id' => $block_id,
            'room_id' => $room_id,
            'bed_no' => $bed_no,
            'bed_occupied' => $bed_occupied,
            'bed_status' => $bed_status,
            'bed_remark' => $bed_remark,
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


    public function list($id){
        $obj = hep_hostel_bed::where([['room_id','=',$id],['recordstatus','!=','DEL']]) 
            ->get([
                'bed_id',
                'bed_no',
                'hostel_id',
                'block_id',
                'room_id',
                'bed_status',
                'bed_occupied',
                'bed_remark'
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
        $bed_id = $request->input('bed_id');
        $bed_no = $request->input('bed_no');
        $bed_status = $request->input('bed_status');
        $bed_remark = $request->input('bed_remark');
        $bed_occupied = $request->input('bed_occupied');
        $recordstatus = $request->input('recordstatus');

        $obj = hep_hostel_bed::where([['bed_id','=',$bed_id]]) -> update([
            'bed_no' => $bed_no,
            'bed_status' => $bed_status,
            'bed_remark' => $bed_remark,
            'bed_occupied' => $bed_occupied,
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
        $bed_id = $request->input('bed_id');

        $obj = hep_hostel_bed::where('bed_id',$bed_id)-> update([
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


    // list by Room Active
    public function listByRoom($id){
        $obj = hep_hostel_bed::SELECT('hep_hostel_bed.*') 
            ->where([
                ['room_id','=',$id],
                ['bed_status','=','Active'],
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


    // list by Room Active & Occupied==No
    public function listByRmActNo($id){
        $obj = hep_hostel_bed::where([
                ['room_id','=',$id],
                ['bed_status','=','Active'],
                ['bed_occupied','=','No'],
                ['recordstatus','!=','DEL']
            ]) 
            ->get();

        if ($obj){
            return response()->json([
                'success'=>'true',
                'message'=>'List Success!',
                'data'=>$obj
            ],200);
        }
    }


    // update status==Booked
    public function uptSttsBooked(Request $request){
        $bed_id = $request->input('bed_id');
        $bed_occupied = $request->input('bed_occupied');
        $recordstatus = $request->input('recordstatus');

        $obj = hep_hostel_bed::where([['bed_id','=',$bed_id]]) ->update([
            'bed_occupied' => $bed_occupied,
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
}
