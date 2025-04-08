<?php

namespace App\Http\Controllers;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use App\Models\mis_std_hostel;

class mis_std_hostelController extends Controller
{
    public function  __construct()
    {
        $this->middleware('auth');
    }

    public function create(Request $request){
        $std_studentid = $request->input('std_studentid');
        $hstl_occupyStatus = $request->input('hstl_occupyStatus');
        $hstl_existence = $request->input('hstl_existence');
        $hstl_name = $request->input('hstl_name');
        $hstl_unit = $request->input('hstl_unit');
        $hstl_semester = $request->input('hstl_semester');
        $lastupdateby = $request->input('users');

        $data = [
            'std_studentid' => $std_studentid,
            'hstl_occupyStatus' => $hstl_occupyStatus,
            'hstl_existence' => $hstl_existence,
            'hstl_name' => $hstl_name,
            'hstl_unit' => $hstl_unit,
            'hstl_semester' => $hstl_semester,
            'lastupdateby' => $lastupdateby,
        ];

        $obj = mis_std_hostel::create($data);

        if($obj){           
            return response()->json([
                'success'=>true,
                'messages'=>'Proses Berjaya',
                'data'=>$obj,
            ],201);
        }
        else {
            return response()->json([
                'success'=>false,
                'messages'=>'Proses Gagal',
                'data'=>'',
            ],400);
        }
    }

    public function update(Request $request){
        $id = $request->input('id');
        $std_studentid = $request->input('std_studentid');
        $hstl_occupyStatus = $request->input('hstl_occupyStatus');
        $hstl_existence = $request->input('hstl_existence');
        $hstl_name = $request->input('hstl_name');
        $hstl_unit = $request->input('hstl_unit');
        $hstl_semester = $request->input('hstl_semester');
        $lastupdateby = $request->input('users');

        $data = [
            'std_studentid' => $std_studentid,
            'hstl_occupyStatus' => $hstl_occupyStatus,
            'hstl_existence' => $hstl_existence,
            'hstl_name' => $hstl_name,
            'hstl_unit' => $hstl_unit,
            'hstl_semester' => $hstl_semester,
            'lastupdateby' => $lastupdateby,
        ];

        $obj = mis_std_hostel::where('pk_id',$id)->update($data);

        if($obj){           
            return response()->json([
                'success'=>true,
                'messages'=>'Update Success',
                'data'=>$obj,
            ],201);
        }
        else {
            return response()->json([
                'success'=>false,
                'messages'=>'Update Fail',
                'data'=>'',
            ],400);
        }
    }

    public function show($id){
        $obj = mis_std_hostel::where('pk_id',$id)->first();

        if($obj){           
            return response()->json([
                'success'=>true,
                'messages'=>'Update Success',
                'data'=>$obj,
            ],201);
        }
        else {
            return response()->json([
                'success'=>false,
                'messages'=>'Update Fail',
                'data'=>'',
            ],400);
        }
    }
    
    public function list($std_studentid){
        $obj = mis_std_hostel::where('std_studentid',$std_studentid)
        ->orderBy('hstl_semester','DESC')
        ->get();

        if($obj){           
            return response()->json([
                'success'=>true,
                'messages'=>'Update Success',
                'data'=>$obj,
            ],201);
        }
        else {
            return response()->json([
                'success'=>false,
                'messages'=>'Update Fail',
                'data'=>'',
            ],400);
        }
    }

}
