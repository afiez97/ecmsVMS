<?php

namespace App\Http\Controllers;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use App\Models\mis_std_acaHistory;

class mis_std_acaHistoryController extends Controller
{
    public function  __construct()
    {
        $this->middleware('auth');
    }

    public function create(Request $request){
        $std_studentid = $request->input('std_studentid');
        $std_alumni = $request->input('std_alumni');
        $std_muet = $request->input('std_muet');
        $std_eduLevel = $request->input('std_eduLevel');
        $std_preUniversity = $request->input('std_preUniversity');
        $std_status = $request->input('std_status');
        $std_year = $request->input('std_year');
        $std_cgpa = $request->input('std_cgpa');
        $lastupdateby = $request->input('users');

        if($file = $request->hasFile('std_transcript')){
            $file = $request->file('std_transcript');
            $std_transcript = $this->uploadFile($file,'_transcript',$std_studentid);               
        }else{
            $std_transcript = '';
        }

        $data = [
            'std_studentid' => $std_studentid,
            'std_alumni' => $std_alumni,
            'std_muet' => $std_muet,
            'std_eduLevel' => $std_eduLevel,
            'std_preUniversity' => $std_preUniversity,
            'std_status' => $std_status,
            'std_year' => $std_year,
            'std_cgpa' => $std_cgpa,
            'std_transcript' => $std_transcript,
            'lastupdateby' => $lastupdateby
        ];

        $obj   = mis_std_acaHistory::create($data);

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
        $pk_id = $request->input('pk_id');
        $std_studentid = $request->input('std_studentid');
        $std_alumni = $request->input('std_alumni');
        $std_muet = $request->input('std_muet');
        $std_eduLevel = $request->input('std_eduLevel');
        $std_preUniversity = $request->input('std_preUniversity');
        $std_status = $request->input('std_status');
        $std_year = $request->input('std_year');
        $std_cgpa = $request->input('std_cgpa');
        $lastupdateby = $request->input('users');

        $objReg = mis_std_acaHistory::where([['recordstatus','!=','DEL'],['pk_id','=',$pk_id]])
        ->first();

        if($file = $request->hasFile('std_transcript')){
            $file = $request->file('std_transcript');
            $std_transcript = $this->uploadFile($file,'_transcript',$std_studentid); 
            if($std_transcript == ""){
                $std_transcript = $objReg->std_transcript;
            }              
        }else{
            $std_transcript = $objReg->std_transcript;
        }

        $data = [
            'std_alumni'        => $std_alumni,
            'std_muet'          => $std_muet,
            'std_eduLevel'      => $std_eduLevel,
            'std_preUniversity' => $std_preUniversity,
            'std_status'        => $std_status,
            'std_year'          => $std_year,
            'std_cgpa'          => $std_cgpa,
            'std_transcript'    => $std_transcript,
            'lastupdateby'      => $lastupdateby,
            'recordstatus'      => 'EDT'
        ];

        $obj   = mis_std_acaHistory::where('pk_id',$pk_id)
        ->where('recordstatus','!=','DEL')
        ->update($data);

        if($obj){           
            return response()->json([
                'success'=>true,
                'messages'=>'Updated Success',
                'data'=>$obj,
            ],201);
        }
        else {
            return response()->json([
                'success'=>false,
                'messages'=>'Updated Fail!',
                'data'=>'',
            ],400);
        }
    }

    public function show($id){
        $obj   = mis_std_acaHistory::where('pk_id',$id)->first();
        if($obj){           
            return response()->json([
                'success'=>true,
                'messages'=>'List Found',
                'data'=>$obj,
            ],200);
        }
        else {
            return response()->json([
                'success'=>false,
                'messages'=>'List Not Found',
                'data'=>'',
            ],200);
        } 
    }

    public function list($id){
        $obj   = mis_std_acaHistory::where('std_studentid',$id)
        ->join('mis_edu_level','mis_edu_level.pk_id','mis_std_acaHistory.std_eduLevel')
        ->join('mis_status','mis_status.sts_status_id','mis_std_acaHistory.std_status')
        ->orderBy('std_year','ASC')
        ->get([
            'mis_std_acaHistory.pk_id',
            'std_studentid',
            'std_alumni',
            'std_muet',
            'std_eduLevel',
            'std_preUniversity',
            'std_status',
            'std_year',
            'std_cgpa',
            'std_transcript',
            'mis_std_acaHistory.lastupdateby',
            'mis_std_acaHistory.lastupdateon',
            'mis_std_acaHistory.recordstatus',
            'mis_edu_level.level',
            'mis_status.sts_status_name_en',
        ]);
        if(sizeof($obj) > 0){           
            return response()->json([
                'success'=>true,
                'messages'=>'List Found',
                'data'=>$obj,
            ],200);
        }
        else {
            return response()->json([
                'success'=>false,
                'messages'=>'List Not Found',
                'data'=>'',
            ],200);
        } 
    }

    public function uploadFile($file,$field,$std_studentid){
        $file_name = "";

        $file_type = $file->getClientOriginalExtension();

        if((strtolower($file_type) == "jpg") || (strtolower($file_type) == "jpeg") || (strtolower($file_type) == "pdf") || (strtolower($file_type) == "png")){
            $file_name = $std_studentid.$field.'.'.$file_type ;
            $destinationPath = 'academic_cur' ;            
            if($file->move($destinationPath,$file_name)){
                //ok
            }
            else{
                $file_name = "";
            }

        }

        return $file_name;
    }
}
