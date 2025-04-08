<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use App\Models\hep_hostel_room;
// use DB;
use Illuminate\Support\Facades\DB;

class hep_hostel_roomController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }
    
    public function register(Request $request) {
        $hostel_id = $request->input('hostel_id');
        $block_id = $request->input('block_id');
        $room_no = $request->input('room_no');
        $total_bed = $request->input('total_bed');
        $occupied_status = $request->input('occupied_status');
        $room_status = $request->input('room_status');
        $room_remark = $request->input('room_remark');
        $recordstatus = $request->input('recordstatus');

        $obj = hep_hostel_room::create([
            'hostel_id' => $hostel_id,
            'block_id' => $block_id,
            'room_no' => $room_no,
            'total_bed' => $total_bed,
            'occupied_status' => $occupied_status,
            'room_status' => $room_status,
            'room_remark' => $room_remark,
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
        $obj = hep_hostel_room::where([['hep_hostel_room.block_id','=',$id],['hep_hostel_room.recordstatus','!=','DEL']]) 
            ->leftjoin('hep_hostel', 'hep_hostel.hostel_id','=','hep_hostel_room.hostel_id')
            ->leftjoin('mis_prm_college', 'mis_prm_college.pk_id','=','hep_hostel.hostel_branch')
            ->leftjoin('hep_hostel_blok', 'hep_hostel_blok.block_id','=','hep_hostel_room.block_id')
            ->get([
                'room_id',
                'room_no',
                'hep_hostel_room.hostel_id AS roomHstl',
                'hostel_name',
                'hostel_branch',
                'clg_name',
                'hep_hostel_room.block_id AS roomBlok',
                'block_name',
                'total_bed',
                'room_status',
                'room_remark',
                'block_gender'
            ]);

        if ($obj){
            return response()->json([
                'success'=>'true',
                'message'=>'List Success!',
                'data'=>$obj
            ],200);
        }
    }


    public function show($id){
        $obj = hep_hostel_room::where('room_id',$id)->first();

        if ($obj){
            return response()->json([
                'success'=>'true',
                'message'=>'Show Success!',
                'data'=>$obj
            ],200);
        }
    }


    public function update(Request $request){
        $room_id = $request->input('room_id');
        $room_no = $request->input('room_no');
        $total_bed = $request->input('total_bed');
        $occupied_status = $request->input('occupied_status');
        $room_status = $request->input('room_status');
        $room_remark = $request->input('room_remark');
        $recordstatus = $request->input('recordstatus');

        $obj = hep_hostel_room::where([['room_id','=',$room_id]]) -> update([
            'room_no' => $room_no,
            'total_bed' => $total_bed,
            'occupied_status' => $occupied_status,
            'room_status' => $room_status,
            'room_remark' => $room_remark,
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
        $room_id = $request->input('room_id');

        $obj = hep_hostel_room::where('room_id',$room_id)-> update([
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


    public function listByBlok($id){

        $subquery = DB::table('hep_hostel_room')
        ->select(
            DB::raw('COUNT(room_no) AS total_occupied'),
            'hep_hostel_room.room_no',
            'hep_hostel_room.room_id',
            'hep_hostel_room.total_bed'
        )
        ->leftJoin('hep_hostel_chkinout', 'hep_hostel_chkinout.room_id', '=', 'hep_hostel_room.room_id')
        ->where('hep_hostel_room.block_id', '=', $id)
        ->where('hep_hostel_room.room_status', '=', 'Active')
        ->where('hep_hostel_room.recordstatus', '!=', 'DEL')
        // ->where('hep_hostel_chkinout.recordstatus', '!=', 'DEL')

        //new
        // ->where('hep_hostel_chkinout.checkIn_status', '!=', 'Check Out')
        ->groupBy('room_no', 'room_id', 'total_bed');

        $obj = DB::table(DB::raw("({$subquery->toSql()}) AS k"))
            ->select('*')
            ->whereRaw('total_occupied < total_bed')
            ->mergeBindings($subquery)
            ->get();

        if ($obj){
            return response()->json([
                'success'=>'true',
                'message'=>'List Success!',
                'data'=>$obj
            ],200);
        }
    }

    public function listByBlok2($id){

        $obj = DB::table('hep_hostel_room as h1')
        ->select('h1.room_id', 'h1.room_no', 'h1.total_bed', DB::raw('CONVERT(COALESCE(k.total_occupied, 0), UNSIGNED) AS total_occupied'))
        ->leftJoinSub(function ($query) {
            $query->select('h2.room_id', DB::raw('SUM(CASE WHEN h2.checkIn_status IS NOT NULL THEN 1 ELSE 0 END) AS total_occupied'))
                  ->from('hep_hostel_chkinout as h2')
                  ->where('h2.checkIn_status', '!=', 'Check Out')
                  ->where('h2.recordstatus', '!=', 'DEL')
                  ->groupBy('h2.room_id');
        }, 'k', 'h1.room_id', '=', 'k.room_id')
        ->where('h1.block_id', $id)
        ->where('h1.recordstatus', '!=', 'DEL')
        ->where('h1.room_status', 'Active')
        // ->whereRaw('h1.total_bed > COALESCE(k.total_occupied, 0)')
        ->get();
    



        if ($obj){
            return response()->json([
                'success'=>'true',
                'message'=>'List Success!',
                'data'=>$obj
            ],200);
        }
    }

    
    public function listAll($genZ){
        // $genZ='';
        $obj = hep_hostel_room::where('hep_hostel_room.recordstatus', '!=', 'DEL')
            ->where(function ($query) {
                $query->where('mis_prm_college.pk_id', 1)
                      ->orWhere('mis_prm_college.pk_id', 3);
            })
            ->when($genZ, function ($query, $genZ) {
                // Only add the gender condition if $userGender is not empty
                if ($genZ) {
                    $query->where('hep_hostel_blok.block_gender', $genZ);
                }
            })
            ->whereNotNull('hep_hostel_blok.block_gender') 
            ->where('hep_hostel.recordstatus', '!=', 'DEL')
            ->where('hep_hostel_blok.recordstatus', '!=', 'DEL')
            ->leftjoin('hep_hostel', 'hep_hostel.hostel_id', '=', 'hep_hostel_room.hostel_id')
            ->leftJoin('mis_prm_college', 'mis_prm_college.pk_id', '=', 'hep_hostel.hostel_branch')
            ->leftJoin('hep_hostel_blok', 'hep_hostel_blok.block_id', '=', 'hep_hostel_room.block_id')
            ->get();
        
        $totalBedSum = $obj->sum('total_bed');

        if ($obj){
            return response()->json([
                'success'=>'true',
                'message'=>'List Success!',
                'data'=>$totalBedSum 
            ],200);
        }
    }
        // ['hep_hostel_blok.block_gender','!=','Male']

}
 //     [
            // //     'room_id',
            // //     'room_no',
            // //     'hep_hostel_room.hostel_id AS roomHstl',
            // //     'hostel_name',
            //     'hostel_branch',
            // //     'clg_name',
            // //     'hep_hostel_room.block_id AS roomBlok',
            // //     'block_name',
            //     'total_bed',
            //     'room_status',
            // //     'room_remark',
            //     'block_gender'
            // ]   