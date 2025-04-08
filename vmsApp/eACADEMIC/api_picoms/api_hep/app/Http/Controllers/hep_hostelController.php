<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use App\Models\hep_hostel;

class hep_hostelController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }
    
    public function register(Request $request){
        $hostel_branch = $request->input('hostel_branch');
        $hostel_name = $request->input('hostel_name');
        $hostel_block = $request->input('hostel_block');
        $hostel_warden = $request->input('hostel_warden');
        $hostel_wardenNo = $request->input('hostel_wardenNo');
        $hostel_status = $request->input('hostel_status');
        $hostel_remark = $request->input('hostel_remark');
        $recordstatus = $request->input('recordstatus');

        $obj = hep_hostel::create([
            'hostel_branch' => $hostel_branch,
            'hostel_name' => $hostel_name,
            'hostel_block' => $hostel_block,
            'hostel_warden' => $hostel_warden,
            'hostel_wardenNo' => $hostel_wardenNo,
            'hostel_status' => $hostel_status,
            'hostel_remark' => $hostel_remark,
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
        $obj = hep_hostel::where('hostel_id',$id)
            ->leftjoin('mis_prm_college', 'mis_prm_college.pk_id', '=' , 'hep_hostel.hostel_branch')
            ->leftjoin('hep_warden', 'hep_warden.pk_id', '=' , 'hep_hostel.hostel_warden')
            ->leftjoin('hrm_emp_info', 'hrm_emp_info.emp_id', '=' , 'hep_warden.emp_warden')
            ->get([
                'clg_name',
                'hostel_name',
                'emp_name',
                'hostel_wardenNo',
                'hostel_status',
            ]);

        if($obj){
            return response()->json([
                'success'=>'true',
                'message'=>'Show Success!',
                'data'=>$obj
            ],200);
        }
    }


    public function list(){
        $obj = hep_hostel::where([['hep_hostel.recordstatus','!=','DEL']])
            ->leftjoin('mis_prm_college', 'mis_prm_college.pk_id', '=' , 'hep_hostel.hostel_branch')
            ->leftjoin('hep_warden', 'hep_warden.pk_id', '=' , 'hep_hostel.hostel_warden')
            ->leftjoin('hrm_emp_info', 'hrm_emp_info.emp_id', '=' , 'hep_warden.emp_warden')
            ->get([
                'hostel_id',
                'hostel_branch',
                'hostel_name',
                'hostel_block',
                'hostel_warden',
                'hostel_wardenNo',
                'hostel_status',
                'hostel_remark',
                'clg_name',
                'emp_name'
            ]);

        if($obj){
            return response()->json([
                'success'=>'true',
                'message'=>'List Success!',
                'data'=>$obj
            ],200);
        }
    }


    public function update(Request $request){
        $hostel_id = $request->input('hostel_id');
        $hostel_branch = $request->input('hostel_branch');
        $hostel_name = $request->input('hostel_name');
        $hostel_block = $request->input('hostel_block');
        $hostel_warden = $request->input('hostel_warden');
        $hostel_wardenNo = $request->input('hostel_wardenNo');
        $hostel_status = $request->input('hostel_status');
        $hostel_remark = $request->input('hostel_remark');
        $recordstatus = $request->input('recordstatus');

        $obj = hep_hostel::where([['hostel_id','=',$hostel_id]]) -> update([
            'hostel_branch' => $hostel_branch,
            'hostel_name' => $hostel_name,
            'hostel_block' => $hostel_block,
            'hostel_warden' => $hostel_warden,
            'hostel_wardenNo' => $hostel_wardenNo,
            'hostel_status' => $hostel_status,
            'hostel_remark' => $hostel_remark,
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
        $hostel_id = $request->input('hostel_id');

        $obj = hep_hostel::where('hostel_id',$hostel_id)-> update([
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


    public function listByBranch($id){
        $obj = hep_hostel::SELECT('hep_hostel.*')
            ->where([
                ['hostel_branch','=',$id],
                // ['hostel_status','=','Active'],
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

    public function listByBranchActive($id){
        $obj = hep_hostel::SELECT('hep_hostel.*')
            ->where([
                ['hostel_branch','=',$id],
                ['hostel_status','!=','In-active'],
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

    public function listByClgAll($id){
        $obj = hep_hostel::where([['hostel_branch','=',$id],['hep_hostel.recordstatus','!=','DEL']])
            ->leftjoin('mis_prm_college', 'mis_prm_college.pk_id', '=' , 'hep_hostel.hostel_branch')
            ->leftjoin('hep_warden', 'hep_warden.pk_id', '=' , 'hep_hostel.hostel_warden')
            ->leftjoin('hrm_emp_info', 'hrm_emp_info.emp_id', '=' , 'hep_warden.emp_warden')
            ->get([
                'hostel_id',
                'hostel_branch',
                'hostel_name',
                'hostel_block',
                'hostel_warden',
                'hostel_wardenNo',
                'hostel_status',
                'hostel_remark',
                'clg_name',
                'emp_name'
                ]);

        if ($obj){
            return response()->json([
                'success'=>'true',
                'message'=>'List Success!',
                'data'=>$obj
            ],200);
        }
    }


    // list hostel status==Active
    public function listActive(){
        $obj = hep_hostel::where([['hep_hostel.recordstatus','!=','DEL'],['hep_hostel.hostel_status','=','Active']])
            ->get([
                'hostel_id',
                'hostel_name'
            ]);

        if ($obj){
            return response()->json([
                'success'=>'true',
                'message'=>'List Success!',
                'data'=>$obj
            ],200);
        }
    }
}
