<?php

namespace App\Http\Controllers;

use App\Models\category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use App\Models\mis_std_curAcademic;
use App\Models\mis_std_regsubject;
use App\Models\mis_prm_calendar;

// use DB; 
use Illuminate\Support\Facades\DB;
use Mockery\Undefined;
use App\Models\log;


class mis_std_curAcademicController extends Controller
{
      
    public function  __construct()
    {
        $this->middleware('auth');
    }

    public function create(Request $request){
        $std_studentid = $request->input('std_studentid');
        $std_semester = $request->input('std_semester');
        $fk_acaCal = $request->input('fk_acaCal');
        $std_duration_study = $request->input('std_duration_study');
        $std_admission = $request->input('std_admission');
        $std_completion = $request->input('std_completion');
        $std_mentor = $request->input('std_mentor');
        $std_senate_endorsement = $request->input('std_senate_endorsement');
        $std_remarks = $request->input('std_remarks');
        // $std_gpa = $request->input('std_gpa');
        // $std_cgpa = $request->input('std_cgpa');
        $std_cect = $request->input('std_cect');
        $std_total_cect = $request->input('std_total_cect');
        $std_total_credit = $request->input('std_total_credit');
        $std_total_hour = $request->input('std_total_hour');

        if($file = $request->hasFile('std_warning_letter1')){
            $file = $request->file('std_warning_letter1');
            $std_warning_letter1 = $this->uploadFile($file,'_warning_letter1',$std_studentid);               
        }else{
            $std_warning_letter1 = '';
        }

        if($file = $request->hasFile('std_warning_letter2')){
            $file = $request->file('std_warning_letter2');
            $std_warning_letter2 = $this->uploadFile($file,'_warning_letter2',$std_studentid);               
        }else{
            $std_warning_letter2 = '';
        }

        if($file = $request->hasFile('std_warning_letter3')){
            $file = $request->file('std_warning_letter3');
            $std_warning_letter3 = $this->uploadFile($file,'_warning_letter3',$std_studentid);               
        }else{
            $std_warning_letter3 = '';
        }

        $data = [
            'std_studentid'             => $std_studentid,
            'std_semester'              => $std_semester ,
            'fk_acaCal'                 => $fk_acaCal ,
            'std_duration_study'        => $std_duration_study,
            'std_admission'             => $std_admission,
            'std_completion'            => $std_completion,
            'std_mentor'                => $std_mentor,
            'std_senate_endorsement'    => $std_senate_endorsement,
            'std_remarks'               => $std_remarks,
            // 'std_gpa'                   => $std_gpa,
            // 'std_cgpa'                  => $std_cgpa,
            'std_cect'                  => $std_cect,
            'std_total_cect'            => $std_total_cect,
            'std_total_credit'          => $std_total_credit,
            'std_total_hour'            => $std_total_hour,
            'std_warning_letter1'       => $std_warning_letter1,
            'std_warning_letter2'       => $std_warning_letter2,
            'std_warning_letter3'       => $std_warning_letter3,
            'recordstatus'              => "ADD",

        ];

        $obj   = mis_std_curAcademic::create($data);

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
        $std_studentid = $request->input('std_studentid');
        $fk_acaCal = $request->input('fk_acaCal');
        $std_semester = $request->input('std_semester');
        $std_duration_study = $request->input('std_duration_study');
        $std_admission = $request->input('std_admission');
        $std_completion = $request->input('std_completion');
        $std_mentor = $request->input('std_mentor');
        $std_senate_endorsement = $request->input('std_senate_endorsement');
        $std_remarks = $request->input('std_remarks');
        // $std_gpa = $request->input('std_gpa');
        // $std_cgpa = $request->input('std_cgpa');
        $std_cect = $request->input('std_cect');
        $std_total_cect = $request->input('std_total_cect');
        $std_total_credit = $request->input('std_total_credit');
        $std_total_hour = $request->input('std_total_hour');

        $objReg = mis_std_curAcademic::where([['recordstatus','!=','DEL'],['std_studentid','=',$std_studentid]])
        ->where('std_semester',$std_semester)
        ->first();

        if($file = $request->hasFile('std_warning_letter1')){
            $file = $request->file('std_warning_letter1');
            $std_warning_letter1 = $this->uploadFile($file,'_warning_letter1',$std_studentid);               
            if($std_warning_letter1 == ""){
                $std_warning_letter1 = $objReg->std_warning_letter1;
            }
        }else{
            $std_warning_letter1 = $objReg->std_warning_letter1;        }

        if($file = $request->hasFile('std_warning_letter2')){
            $file = $request->file('std_warning_letter2');
            $std_warning_letter2 = $this->uploadFile($file,'_warning_letter2',$std_studentid);               
            if($std_warning_letter2 == ""){
                $std_warning_letter2 = $objReg->std_warning_letter2;
            }
        }else{
            $std_warning_letter2= $objReg->std_warning_letter2;            
        }

        if($file = $request->hasFile('std_warning_letter3')){
            $file = $request->file('std_warning_letter3');
            $std_warning_letter3 = $this->uploadFile($file,'_warning_letter3',$std_studentid);               
            if($std_warning_letter3 == ""){
                $std_warning_letter3 = $objReg->std_warning_letter3;
            }
        }else{
            $std_warning_letter3 = $objReg->std_warning_letter3;
        }

        $data = [
            'std_duration_study'        => $std_duration_study,
            'fk_acaCal'                 => $fk_acaCal ,
            'std_admission'             => $std_admission,
            'std_completion'            => $std_completion,
            'std_mentor'                => $std_mentor,
            'std_senate_endorsement'    => $std_senate_endorsement,
            'std_remarks'               => $std_remarks,
            // 'std_gpa'                   => $std_gpa,
            // 'std_cgpa'                  => $std_cgpa,
            'std_cect'                  => $std_cect,
            'std_total_cect'            => $std_total_cect,
            'std_total_credit'          => $std_total_credit,
            'std_total_hour'            => $std_total_hour,
            'std_warning_letter1'       => $std_warning_letter1,
            'std_warning_letter2'       => $std_warning_letter2,
            'std_warning_letter3'       => $std_warning_letter3,
            'recordstatus'              => "EDT",

        ];

        $obj   = mis_std_curAcademic::
        where('std_studentid',$std_studentid)
        ->where('std_semester',$std_semester)
        ->update($data);

        if($obj){  
            $obj = $this->show($std_studentid,$std_semester);         
            return $obj;
        }
        else {
            return response()->json([
                'success'=>false,
                'messages'=>'Proses Gagal',
                'data'=>'',
            ],400);
        }
    }

    public function getCGPA($std_studentid,$pk,$std_semester){

        $obj = mis_std_curAcademic::where('std_studentid',$std_studentid)->where('PK_cur_academic','!=',$pk)
        ->where('std_semester','<',$std_semester)
        ->where('curAcademic_type',"!=",'Deferred')
        ->where('recordstatus',"!=",'DEL')
        ->groupBy('std_studentid')
        ->first([
            DB::raw('SUM(tc) AS sumTC'),
            DB::raw('SUM(tgp) AS sumTGP'),
            DB::raw('(SUM(tgp) / SUM(tc)) AS CGPA'),
            'std_studentid'
        ]);

        if($obj){           
            return response()->json([
                'success'=>true,
                'messages'=>'CGPA Success',
                'data'=>$obj,
            ],200);
        }
        else {
            return response()->json([
                'success'=>false,
                'messages'=>'CGPA Failed',
                'data'=>'',
            ],400);
        } 
    }

    public function updateGPA(Request $request){
        $pk_cur_academic = $request->input('id');
        $std_gpa = $request->input('std_gpa');
        $std_cgpa = $request->input('std_cgpa');
        $tc = $request->input('tc');
        $tcp = $request->input('tcp');
        $tgp = $request->input('tgp');
        $updated_by = $request->input('updated_by');
        
        $data = [
            'std_gpa' => $std_gpa,
            'std_cgpa' => $std_cgpa,
            'tc' => $tc,
            'tcp' => $tcp,
            'tgp' => $tgp
        ];

        $obj = mis_std_curAcademic::where('pk_cur_academic',$pk_cur_academic)->update($data);
        
        if($obj){           

            // $clientIP = $_SERVER['REMOTE_ADDR'];
            // dd($clientIP);
            
             //insert log
            // dd(Session::get('usrName'));

            // if ($_SESSION['usrName']) {

            //     $updated_by = $_SESSION['usrName'];

            // }else{$updated_by = '';}
            $updated_by = $updated_by ?? '';

            
            $this->logAudit([                
                'activity' => 'updateGPA',
                'ip_address' =>$_SERVER['REMOTE_ADDR'],
                // 'ip_address' =>  $request->getClientIp(),
                'message' => 'Update Successful',
                'datalist' => json_encode($data),
                'updated_by'=>$updated_by,
                'statusrekod' => 200,
            ]);

            return response()->json([
                'success'=>true,
                'messages'=>'Updated Success',
                'data'=>$obj,
            ],201);
        }
        else {

            $this->logAudit([
                'activity' =>'Update Status Student Register Course',
                'ip_address' => $request->getClientIp(),
                'datalist' => json_encode($data),
                'message' => 'Update Failed',
                // 'created_by'=>$_SESSION['usrName'],
                'updated_by'=>$updated_by,
                'statusrekod' => 400,
            ]);

            return response()->json([
                'success'=>false,
                'messages'=>'Updated Failed',
                'data'=>'',
            ],401);
        }        
    }

    public function show($id,$semester){
        $obj   = mis_std_curAcademic::where('std_studentid',$id)
        ->where('std_semester',$semester)
        ->where('recordstatus','!=','DEL')->first();
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

    public function showAcaCal($id,$fk_acaCal){
        $obj   = mis_std_curAcademic::where('std_studentid',$id)
        ->where('fk_acaCal',$fk_acaCal)
        ->where('recordstatus','!=','DEL')->first();
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

    public function curShow($id){
        $obj   = mis_std_curAcademic::where('std_studentid',$id)
        ->where('recordstatus','!=','DEL')
        ->orderByDesc('std_semester')
        ->first();
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

    public function list(){
        $obj   = mis_std_curAcademic::where('recordstatus','!=','DEL')->get();
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

    public function delete(Request $request){
        $std_studentid = $request->input('std_studentid');
        $obj   = mis_std_curAcademic::where('std_studentid',$std_studentid)->update(["recordstatus" => "DEL"]);
        if($obj){           
            return response()->json([
                'success'=>true,
                'messages'=>'Delete List Success',
                'data'=>$obj,
            ],200);
        }
        else {
            return response()->json([
                'success'=>false,
                'messages'=>'Delete List Fail',
                'data'=>'',
            ],400);
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


    // student update semester when register course
    public function uptSem(Request $request){
        $pk_cur_academic = $request->input('pk_cur_academic');
        $std_semester = $request->input('std_semester');
        $recordstatus = $request->input('recordstatus');

        $obj = mis_std_curAcademic::where([['pk_cur_academic','=',$pk_cur_academic],['recordstatus','!=','DEL']]) ->update([
            'std_semester' => $std_semester,
            'recordstatus' => $recordstatus,
        ]);

        if($obj){
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


    // student add semester when register course
    public function addSem(Request $request){
        $std_studentid = $request->input('std_studentid');
        $std_semester = $request->input('std_semester');
        $fk_acaCal = $request->input('fk_acaCal');
        $recordstatus = $request->input('recordstatus');

        $obj = mis_std_curAcademic::create([
            'std_studentid' => $std_studentid,
            'std_semester' => $std_semester,
            'fk_acaCal' => $fk_acaCal,
            'recordstatus' => $recordstatus,
        ]);

        if($obj){
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


    // check student current semester
    public function chkStdCurSem($id){
        $obj = mis_std_curAcademic::where([['std_studentid','=',$id],
                ['mis_std_curAcademic.recordstatus','!=','DEL']
                ]) 
            ->leftjoin('mis_prm_calendar', 'mis_prm_calendar.cal_id','=','mis_std_curAcademic.fk_acaCal')
            ->orderBy('std_semester', 'desc') 
            ->get([
                'pk_cur_academic',
                'std_semester',
                'fk_acaCal',
                'curAcademic_type',
                'cur_year',
                'cal_cohort',
                'std_gpa',
                'std_cgpa',
                'std_remarks',
                'std_release',
                'std_senate_endorsement', 
                'cal_status', 
                'mis_prm_calendar.cal_category',
                'mis_std_curAcademic.acaCal_weeks'

            ]);

        if($obj){
            return response()->json([
                'success'=>true,
                'message'=>"Papar Berjaya!",
                'data' => $obj
            ],200);
        }
        else{
            return response()->json([
                'success'=>false,
                'message'=>"Papar Gagal!",
                'data'=>''
            ],404);
        }
    }

       // check student current semester
       public function chkStdCurSemTranscipt($id){
        $obj = mis_std_curAcademic::where([['std_studentid','=',$id],
                ['mis_std_curAcademic.recordstatus','!=','DEL'],
                ['mis_std_curAcademic.curAcademic_type','!=','Deferred']
                ]) 
            ->leftjoin('mis_prm_calendar', 'mis_prm_calendar.cal_id','=','mis_std_curAcademic.fk_acaCal')
            ->orderBy('std_semester') 
            ->get([
                'pk_cur_academic',
                'std_semester',
                'fk_acaCal',
                'curAcademic_type',
                'cur_year',
                'cal_cohort',
                'std_gpa',
                'std_cgpa',
                'tc',
                'std_remarks',
                'std_release',
                'std_senate_endorsement', 
                'cal_status', 
                'mis_prm_calendar.cal_category',
                'mis_std_curAcademic.acaCal_weeks'

            ]);

        $sumtc = $obj->sum('tc');

        $maxResult = mis_std_curAcademic::where([
            ['std_studentid', '=', $id],
            ['mis_std_curAcademic.recordstatus', '!=', 'DEL'],
            ['mis_std_curAcademic.curAcademic_type', '!=', 'Deferred']
        ])
        ->orderBy('std_semester', 'desc')
        ->first(['std_cgpa', 'std_senate_endorsement']);


        if($obj){
            return response()->json([
                'success'=>true,
                'message'=>"Papar Berjaya!",
                'sumtc' => $sumtc,
                'maxcGpa' => $maxResult->std_cgpa,
                'maxSenate' => $maxResult->std_senate_endorsement,
                'data' => $obj
            ],200);
        }
        else{
            return response()->json([
                'success'=>false,
                'message'=>"Papar Gagal!",
                'data'=>''
            ],404);
        }
    }

    public function chkStdCurSem2($id){
        $obj = mis_std_curAcademic::where([['std_studentid','=',$id],
                ['mis_std_curAcademic.recordstatus','!=','DEL']
                ]) 
            ->leftjoin('mis_prm_calendar', 'mis_prm_calendar.cal_id','=','mis_std_curAcademic.fk_acaCal')
            ->orderBy('std_semester') 
            ->get([
                'pk_cur_academic',
                'std_semester',
                'fk_acaCal',
                'curAcademic_type',
                'cur_year',
                'cal_cohort',
                'std_gpa',
                'std_cgpa',
                'std_remarks',
                'std_release',
                'std_senate_endorsement', 
                'cal_status', 
                'mis_prm_calendar.cal_category',
                'mis_std_curAcademic.acaCal_weeks'

            ]);

        if($obj){
            return response()->json([
                'success'=>true,
                'message'=>"Papar Berjaya!",
                'data' => $obj
            ],200);
        }
        else{
            return response()->json([
                'success'=>false,
                'message'=>"Papar Gagal!",
                'data'=>''
            ],404);
        }
    }

    public function releaseResult($id){
        $obj = mis_std_curAcademic::where('pk_cur_academic',$id)->update(['std_senate_endorsement' => date('Y-m-d H:i:s')]);

        if($obj){
            $this->logAudit([
                
                
                'activity' => 'Release Result Student',
                'ip_address' => $_SERVER['REMOTE_ADDR'],
                'message' => 'Update Successful',
                'datalist' => json_encode(['std_senate_endorsement' => date('Y-m-d H:i:s')]),
                // 'updated_by'=>$updated_by,
                'statusrekod' => 200,
            ]);

            return response()->json([
                'success'=>true,
                'message'=>"Update Success!",
                'data' => $obj
            ],200);
        }
        else{

              $this->logAudit([
                'activity' =>'Release Result Student',
                'ip_address' => $_SERVER['REMOTE_ADDR'],
                'datalist' => json_encode(['std_senate_endorsement' => date('Y-m-d H:i:s')]),
                'message' => 'Failed to Release Result Student',
                // 'created_by'=>$_SESSION['usrName'],
                // 'updated_by'=>$_SESSION['usrName'],
                'statusrekod' => 400,
            ]);
            return response()->json([
                'success'=>false,
                'message'=>"Update Failed!",
                'data'=>''
            ],404);
        }
    }


    // find sem student
    public function findSem(Request $request){
        $std_studentid = $request->input('std_studentid');
        $std_semester = $request->input('std_semester');

        $obj = mis_std_curAcademic::where([
            ['std_studentid', $std_studentid],
            ['std_semester', $std_semester],
            ['recordstatus', '!=', 'DEL'],
        ]) ->get('pk_cur_academic');

        if($obj){
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

    public function update_curAcademicType(Request $request){
        $std_studentid = $request->input('std_studentid');
        $fk_acaCal = $request->input('session_deffered');
        $deffered_weeks = $request->input('deffered_weeks');

        $obj = mis_std_curAcademic::
        where('std_studentid',$std_studentid)
        ->where('fk_acaCal',$fk_acaCal)
        ->update(['curAcademic_type' => 'Deferred', 'acaCal_weeks' => $deffered_weeks,]);
        
        if($obj)
        {
            $obj_regSubject = mis_std_regsubject::
            where('std_studentid',$std_studentid)
            ->where('aca_session',$fk_acaCal)
            ->update(['rsb_status' => 'Deferred']);

            return response()->json([
                'success'=>true,
                'message'=>"Update Deferred Session Success!",
                'data' => $obj,
                'data_regSubject' => $obj_regSubject
            ],200);
        }
        else{
            return response()->json([
                'success'=>false,
                'message'=>"Update Deferred Session Failed!",
                'data'=>'', 
                'data_regSubject' => ''
            ],400);
        }
    }

    public function upt_curAcademicType(Request $request){
        $std_studentid = $request->input('std_studentid');
        $sts_status = $request->input('sts_status');
        $fk_acaCal = $request->input('fk_acaCal');
        $pk_cur_academic = $request->input('pk_cur_academic');
        $acaCal_weeks = $request->input('acaCal_weeks');

        $obj = mis_std_curAcademic::
        when($pk_cur_academic != null, function($query) use($pk_cur_academic){
            return $query->where('pk_cur_academic',$pk_cur_academic);
        })
        ->when($pk_cur_academic == null, function($query) use($std_studentid,$sts_status,$fk_acaCal){
            return $query->where('std_studentid',$std_studentid)
            ->where('fk_acaCal',$fk_acaCal);
        })
        ->update(['curAcademic_type' => $sts_status,'acaCal_weeks' => $acaCal_weeks]);

        if($obj){
            $obj_regSubject = mis_std_regsubject::where('std_studentid',$std_studentid)
            ->where('aca_session',$fk_acaCal)->update(['rsb_status' => $sts_status]);

            return response()->json([
                'success'=>true,
                'message'=>"Update Deferred Session Success!",
                'data' => $obj,
                'data_regSubject' => $obj_regSubject
            ],200);
        }
        else{
            return response()->json([
                'success'=>false,
                'message'=>"Update Deferred Session Failed!",
                'data'=>'',
                // 'data_regSubject' => ''
            ],400);
        }
    }

    public function latestSem($std_studentid){
        $obj = mis_std_curAcademic::where('std_studentid',$std_studentid)
        ->orderBy('std_semester','DESC')
        ->limit(1)
        ->first();

        if($obj){

            return response()->json([
                'success'=>true,
                'message'=>"Latest Session Registed!",
                'data' => $obj
            ],200);
        }
        else{
            return response()->json([
                'success'=>false,
                'message'=>"No Data Found!",
                'data'=>''
            ],400);
        }
    }

    // check sem student by Academic Session
    public function chkStdSem(Request $request){
        $std_studentid = $request->input('std_studentid');
        $fk_acaCal = $request->input('fk_acaCal');

        $obj = mis_std_curAcademic::where([
            ['std_studentid', $std_studentid],
            ['fk_acaCal', $fk_acaCal],
            ['recordstatus', '!=', 'DEL'],
        ]) 
        ->get(['pk_cur_academic','std_semester']);

        if($obj){
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

    public function acSummary(Request $request){
        $cal_cohort = $request->input('cal_cohort');
        $pgm_fk = $request->input('pgm_fk');
        $cur_year = $request->input('cur_year');

        $obj = mis_std_curAcademic::
        leftjoin('mis_std_info','mis_std_info.std_studentid','mis_std_curAcademic.std_studentid')
        ->leftjoin('mis_prm_calendar','mis_prm_calendar.cal_id','mis_std_curAcademic.fk_acaCal')
        ->where([
            ['mis_prm_calendar.cal_cohort', $cal_cohort],
            ['pgm_fk', $pgm_fk],
            ['cur_year', $cur_year],
            ['mis_std_curAcademic.recordstatus', '!=', 'DEL'],
        ]) 
        ->orderBy('mis_std_info.std_studentid','asc')
        ->get([
            'mis_std_curAcademic.fk_acaCal',
            'mis_std_curAcademic.fk_acaCal AS cal_id',
            'mis_std_curAcademic.pk_cur_academic',
            'mis_std_curAcademic.curAcademic_type',
            'mis_std_info.std_studentid',
            'mis_std_info.sti_name',
            'mis_std_info.sti_icno',
            'mis_std_info.pgm_fk',
            'mis_std_info.pgm_id',
            'mis_std_info.cur_intake',
            'mis_std_curAcademic.std_gpa',
            'mis_std_curAcademic.std_cgpa',
            'mis_std_curAcademic.std_remarks',
            'mis_std_curAcademic.std_release',
            'std_semester',
            'mis_prm_calendar.cal_intake',
            'mis_prm_calendar.cal_cohort',
            'mis_prm_calendar.cur_year',
            'status_academic'
        ]);

        if($obj){
            return response()->json([
                'success'=>true,
                'message'=>"Data Found!",
                'data' => $obj
            ],200);
        }
        else{
            return response()->json([
                'success'=>false,
                'message'=>"No Data Found!",
                'data'=>''
            ],400);
        }                
    }

    public function stdByFaculty(Request $request){
        $fac_id = $request->input('fac_id');
        $cal_cohort = $request->input('cal_cohort');
        $cur_year = $request->input('cur_year');
        $cam_id = $request->input('cam_id');

        $obj = mis_std_curAcademic::join('mis_std_info', function ($join) {
            $join->on('mis_std_info.std_studentid', '=', 'mis_std_curAcademic.std_studentid')
                ->where('mis_std_info.recordstatus','!=', 'DEL');
        })
        ->join('mis_prm_progcampus', function ($join) {
            $join->on('mis_prm_progcampus.pgm_id', '=', 'mis_std_info.pgm_fk')
                ->whereColumn('mis_std_info.cam_id', 'mis_prm_progcampus.cam_id');
        })
        ->leftjoin('mis_prm_calendar','mis_prm_calendar.cal_id','mis_std_curAcademic.fk_acaCal')
        ->where('fac_id',$fac_id)
        ->where('mis_prm_calendar.cal_cohort',$cal_cohort)
        ->where('cur_year',$cur_year)
        ->where('mis_prm_progcampus.cam_id',$cam_id)
        ->where('mis_std_curAcademic.recordstatus','!=','DEL')
        ->orderBy('mis_std_info.pgm_id','ASC')
        ->orderBy('std_semester','ASC')
        ->orderBy('mis_std_info.std_studentid','ASC')
        ->get([
            'fk_acaCal',
            'sti_name',
            'mis_std_info.cur_intake',
            'mis_std_curAcademic.curAcademic_type',
            'sti_icno',
            'mis_std_curAcademic.std_studentid',
            'std_semester',
            'pgm_fk',
            'mis_std_info.pgm_id',
            'fac_id',
            'std_gpa',
            'std_cgpa',
            'status_academic'
        ]);

        if(sizeof($obj)>0){
            return response()->json([
                'success'=>true,
                'message'=>"Data Found!",
                'data' => $obj
            ],200);
        }
        else{
            return response()->json([
                'success'=>false,
                'message'=>"No Data Found!",
                'data'=>''
            ],400);
        } 
    }

    public function stdSession(Request $request){
        // $fk_acaCal = $request->input('fk_acaCal');
        $cal_cohort = $request->input('cal_cohort');
        $cur_year = $request->input('cur_year');

        $obj = mis_std_curAcademic::join('mis_std_info', function ($join) {
            $join->on('mis_std_info.std_studentid', '=', 'mis_std_curAcademic.std_studentid')
                ->where('mis_std_info.recordstatus','!=', 'DEL');
        })
        ->join('mis_prm_progcampus', function ($join) {
            $join->on('mis_prm_progcampus.pgm_id', '=', 'mis_std_info.pgm_fk')
                ->whereColumn('mis_std_info.cam_id', 'mis_prm_progcampus.cam_id');
        })
        ->leftjoin('mis_prm_calendar','mis_prm_calendar.cal_id','mis_std_curAcademic.fk_acaCal')
        // ->where('fk_acaCal',$fk_acaCal)
        ->where('mis_prm_calendar.cal_cohort',$cal_cohort)
        ->where('cur_year',$cur_year)
        ->where('mis_std_curAcademic.recordstatus','!=','DEL')
        ->orderBy('fac_id','ASC')
        ->orderBy('mis_std_info.pgm_id','ASC')
        ->orderBy('std_semester','ASC')
        ->orderBy('mis_std_info.std_studentid','ASC')
        ->get([
            'pk_cur_academic',
            'fk_acaCal',
            'sti_name',
            'sti_icno',
            'mis_std_curAcademic.std_studentid',
            'mis_std_curAcademic.curAcademic_type',
            'mis_std_curAcademic.std_remarks',
            'mis_std_curAcademic.std_release',
            'std_semester',
            'pgm_fk',
            'mis_std_info.pgm_id',
            'mis_std_info.cur_intake',
            'mis_std_info.sti_session_id',
            'fac_id',
            'mis_prm_progcampus.cam_id',
            'std_gpa',
            'std_cgpa',
            'status_academic',
            'std_senate_endorsement'
        ]);

        if(sizeof($obj)>0){
            return response()->json([
                'success'=>true,
                'message'=>"Data Found!",
                'data' => $obj
            ],200);
        }
        else{
            return response()->json([
                'success'=>false,
                'message'=>"No Data Found!",
                'data'=>''
            ],400);
        } 
    }

    public function contResult(Request $request){
        $cal_cohort = $request->input('cal_cohort');
        $cur_year = $request->input('cur_year');
        
        $obj = mis_std_curAcademic::join('mis_std_info', function ($join) {
            $join->on('mis_std_info.std_studentid', '=', 'mis_std_curAcademic.std_studentid')
                ->where('mis_std_info.recordstatus','!=', 'DEL');
        })
        ->join('intake', function ($join){
            $join->on('intake.intake_name',DB::RAW('SUBSTRING(mis_std_info.cur_intake,1,3)'))
            ->whereColumn('intake_year',DB::RAW('SUBSTRING(mis_std_info.cur_intake,5,4)'))
            ->where('mis_std_info.recordstatus','!=', 'DEL');
        })
        ->leftjoin('mis_prm_calendar','mis_prm_calendar.cal_id','mis_std_curAcademic.fk_acaCal')
        // ->where('fk_acaCal',$fk_acaCal)
        ->where('mis_prm_calendar.cal_cohort',$cal_cohort)
        ->where('cur_year',$cur_year)
        ->where('mis_std_curAcademic.recordstatus', '!=', 'DEL')
        ->groupBy('cur_intake', 'std_semester','intake_year','intake_name')
        ->orderBy('std_semester', 'DESC')
        ->orderBy('intake_year','ASC')
        ->orderBy('intake_name','ASC')
        ->get([
            DB::raw('COUNT(std_semester) AS total'), 'cur_intake', 'std_semester'
        ]);

        if(sizeof($obj)>0){
            return response()->json([
                'success'=>true,
                'message'=>"Data Found!",
                'data' => $obj
            ],200);
        }
        else{
            return response()->json([
                'success'=>false,
                'message'=>"No Data Found!",
                'data'=>''
            ],400);
        } 
    }

    public function cont_standingByIntake_sem(Request $request){
        $cur_intake = $request->input('cur_intake');
        $std_semester = $request->input('std_semester');
        $fk_acaCal = $request->input('fk_acaCal');
        $fac_id = $request->input('fac_id');

        $obj = mis_std_curAcademic::join('mis_std_info', function ($join) {
            $join->on('mis_std_info.std_studentid', '=', 'mis_std_curAcademic.std_studentid')
                ->where('mis_std_info.recordstatus','!=', 'DEL');
        })
        ->join('mis_prm_progcampus', function ($join) {
            $join->on('mis_prm_progcampus.pgm_id', '=', 'mis_std_info.pgm_fk')
                ->whereColumn('mis_std_info.cam_id', 'mis_prm_progcampus.cam_id');
        })
        ->where(function($q) use($fac_id){
            if($fac_id != null){
                $q->where('fac_id',$fac_id);
            }
        })
        ->where('fk_acaCal', $fk_acaCal)
        ->whereBetween('std_cgpa', [1.50, 2.00])
        ->where('mis_std_curAcademic.recordstatus', '!=', 'DEL')
        ->where('cur_intake', $cur_intake)
        ->where('std_semester', $std_semester)
        ->groupBy('cur_intake', 'std_semester')
        ->orderBy('cur_intake', 'asc')
        ->orderBy('std_semester', 'asc')
        ->get([
            DB::RAW('COUNT(std_semester) AS total'),
            'cur_intake',
            'std_semester'
        ]);

        if(sizeof($obj)>0){
            return response()->json([
                'success'=>true,
                'message'=>"Data Found!",
                'data' => $obj
            ],200);
        }
        else{
            return response()->json([
                'success'=>false,
                'message'=>"No Data Found!",
                'data'=>''
            ],400);
        } 
    }

    public function good_standingByIntake_sem(Request $request){
        $cur_intake = $request->input('cur_intake');
        $std_semester = $request->input('std_semester');
        $fk_acaCal = $request->input('fk_acaCal');
        $fac_id = $request->input('fac_id');

        $obj = mis_std_curAcademic::join('mis_std_info', function ($join) {
            $join->on('mis_std_info.std_studentid', '=', 'mis_std_curAcademic.std_studentid')
                ->where('mis_std_info.recordstatus','!=', 'DEL');
        })
        ->join('mis_prm_progcampus', function ($join) {
            $join->on('mis_prm_progcampus.pgm_id', '=', 'mis_std_info.pgm_fk')
                ->whereColumn('mis_std_info.cam_id', 'mis_prm_progcampus.cam_id');
        })
        ->where(function($q) use($fac_id){
            if($fac_id != null){
                $q->where('fac_id',$fac_id);
            }
        })
        ->where('fk_acaCal', $fk_acaCal)
        ->where('std_cgpa',">=", 2.00)
        ->where('mis_std_curAcademic.recordstatus', '!=', 'DEL')
        ->where('cur_intake', $cur_intake)
        ->where('std_semester', $std_semester)
        ->groupBy('cur_intake', 'std_semester')
        ->orderBy('cur_intake', 'asc')
        ->orderBy('std_semester', 'asc')
        ->get([
            DB::RAW('COUNT(std_semester) AS total'),
            'cur_intake',
            'std_semester'
        ]);

        if(sizeof($obj)>0){
            return response()->json([
                'success'=>true,
                'message'=>"Data Found!",
                'data' => $obj
            ],200);
        }
        else{
            return response()->json([
                'success'=>false,
                'message'=>"No Data Found!",
                'data'=>''
            ],400);
        } 
    }

    public function failed_standingByIntake_sem(Request $request){
        $cur_intake = $request->input('cur_intake');
        $std_semester = $request->input('std_semester');
        $fk_acaCal = $request->input('fk_acaCal');
        $fac_id = $request->input('fac_id');

        // dd($fac_id);

        $obj = mis_std_curAcademic::join('mis_std_info', function ($join) {
            $join->on('mis_std_info.std_studentid', '=', 'mis_std_curAcademic.std_studentid')
                ->where('mis_std_info.recordstatus','!=', 'DEL');
        })
        ->join('mis_prm_progcampus', function ($join) {
            $join->on('mis_prm_progcampus.pgm_id', '=', 'mis_std_info.pgm_fk')
                ->whereColumn('mis_std_info.cam_id', 'mis_prm_progcampus.cam_id');
        })
        ->where(function($q) use($fac_id){
            if($fac_id != null){
                $q->where('fac_id',$fac_id);
            }
        })
        ->where('fk_acaCal', $fk_acaCal)
        ->where(function($query) {
            $query->where('std_cgpa', '<', 1.5)
                ->orWhereNull('std_cgpa');
        })
        ->where('mis_std_curAcademic.recordstatus', '!=', 'DEL')
        ->where('cur_intake', $cur_intake)
        ->where('std_semester', $std_semester)
        ->groupBy('cur_intake', 'std_semester')
        ->orderBy('cur_intake', 'asc')
        ->orderBy('std_semester', 'asc')
        ->get([
            DB::RAW('COUNT(std_semester) AS total'),
            'cur_intake',
            'std_semester'
        ]);

        if(sizeof($obj)>0){
            return response()->json([
                'success'=>true,
                'message'=>"Data Found!",
                'data' => $obj
            ],200);
        }
        else{
            return response()->json([
                'success'=>false,
                'message'=>"No Data Found!",
                'data'=>''
            ],400);
        } 
    }

    public function contFac(Request $request){
        $fac_id = $request->input('fac_id');
        $cal_cohort = $request->input('cal_cohort');
        $cur_year = $request->input('cur_year');

        $obj = mis_std_curAcademic::
        join('mis_std_info', function ($join) {
            $join->on('mis_std_info.std_studentid', '=', 'mis_std_curAcademic.std_studentid')
                ->where('mis_std_info.recordstatus','!=', 'DEL');
        })
        ->leftjoin('mis_prm_calendar','mis_prm_calendar.cal_id','mis_std_curAcademic.fk_acaCal')
        ->join('mis_prm_progcampus', function ($join) {
            $join->on('mis_prm_progcampus.pgm_id', '=', 'mis_std_info.pgm_fk')
                ->whereColumn('mis_std_info.cam_id', 'mis_prm_progcampus.cam_id');
        })
        ->join('intake', function ($join){
            $join->on('intake.intake_name',DB::RAW('SUBSTRING(mis_std_info.cur_intake,1,3)'))
            ->whereColumn('intake_year',DB::RAW('SUBSTRING(mis_std_info.cur_intake,5,4)'))
            ->where('mis_std_info.recordstatus','!=', 'DEL');
        })
        ->where('mis_prm_calendar.cal_cohort', $cal_cohort)
        ->where('mis_prm_calendar.cur_year', $cur_year)
        ->where('fac_id', $fac_id)
        ->where('mis_std_curAcademic.recordstatus', '!=', 'DEL')
        ->groupBy('cur_intake', 'std_semester','intake_year','intake_name')
        ->orderBy('std_semester', 'DESC')
        ->orderBy('intake_year','ASC')
        ->orderBy('intake_name','ASC')
        ->get([
            DB::raw('COUNT(std_semester) AS total'), 'cur_intake', 'std_semester'
        ]);

        if(sizeof($obj)>0){
            return response()->json([
                'success'=>true,
                'message'=>"Data Found!",
                'data' => $obj
            ],200);
        }
        else{
            return response()->json([
                'success'=>false,
                'message'=>"No Data Found!",
                'data'=>''
            ],400);
        } 
    }

    public function contPgm(Request $request){
        $pgm_id = $request->input('pgm_fk');
        $cal_cohort = $request->input('cal_cohort');
        $cur_year = $request->input('cur_year');

        $obj = mis_std_curAcademic::
        join('mis_std_info', function ($join) {
            $join->on('mis_std_info.std_studentid', '=', 'mis_std_curAcademic.std_studentid')
                ->where('mis_std_info.recordstatus','!=', 'DEL');
        })
        ->leftjoin('mis_prm_calendar','mis_prm_calendar.cal_id','mis_std_curAcademic.fk_acaCal')
        ->join('mis_prm_progcampus', function ($join) {
            $join->on('mis_prm_progcampus.pgm_id', '=', 'mis_std_info.pgm_fk')
                ->whereColumn('mis_std_info.cam_id', 'mis_prm_progcampus.cam_id');
        })
        ->join('intake', function ($join){
            $join->on('intake.intake_name',DB::RAW('SUBSTRING(mis_std_info.cur_intake,1,3)'))
            ->whereColumn('intake_year',DB::RAW('SUBSTRING(mis_std_info.cur_intake,5,4)'))
            ->where('mis_std_info.recordstatus','!=', 'DEL');
        })
        ->where('mis_prm_calendar.cal_cohort', $cal_cohort)
        ->where('mis_prm_calendar.cur_year', $cur_year)
        ->where('mis_std_info.pgm_fk', $pgm_id)
        ->where('mis_std_curAcademic.recordstatus', '!=', 'DEL')
        ->groupBy('cur_intake', 'std_semester','intake_year','intake_name')
        ->orderBy('std_semester', 'DESC')
        ->orderBy('intake_year','ASC')
        ->orderBy('intake_name','ASC')
        ->get([
            DB::raw('COUNT(std_semester) AS total'), 'cur_intake', 'std_semester'
        ]);

        if(sizeof($obj)>0){
            return response()->json([
                'success'=>true,
                'message'=>"Data Found!",
                'data' => $obj
            ],200);
        }
        else{
            return response()->json([
                'success'=>false,
                'message'=>"No Data Found!",
                'data'=>''
            ],400);
        } 
    }

    public function latestCGPAudit($std_studentid){
        $result = mis_std_curAcademic::select(
            // '*'
            'pk_cur_academic',
            'fk_acaCal',
            'mis_std_curAcademic.std_studentid',
            'std_semester',
            'std_gpa',
            'std_cgpa',
            'std_cect',
            'mis_std_curAcademic.lastupdateon',
            'mis_std_curAcademic.lastupdateby',
            'mis_std_curAcademic.lastapproveon',
            'mis_std_curAcademic.recordstatus',
            'tc',
            'tcp',
            'tgp',
            'cal_intake',
            'cur_year',
            'cur_intake',
            'sti_session_id',
            'pgm_fk',
            'mis_prm_programme.pgm_duration',
            'duration_std'
        )
        ->leftJoin('mis_std_info', 'mis_std_curAcademic.std_studentid', '=', 'mis_std_info.std_studentid')
        ->leftJoin('mis_prm_calendar', 'mis_std_curAcademic.fk_acaCal', '=', 'mis_prm_calendar.cal_id')
        ->leftJoin('mis_prm_programme', 'mis_prm_programme.pk_id', '=', 'mis_std_info.pgm_fk')
        ->where('mis_std_curAcademic.std_studentid', $std_studentid)
        ->whereNotNull('std_cgpa')
        ->orderByDesc('std_semester')
        // ->get();
        ->first();
        // dd($result);


        // if(sizeof($result)>0){
        if ($result){
            return response()->json([
                'success'=>'true',
                'message'=>'List Success!',
                'data'=>$result
            ],200);
        }
        else{
            return response()->json([
                'success'=>false,
                'message'=>'Data Failed!',
                'data'=>''
            ],200);
        }
       
    }


    public function reportListStudent(Request $request){
        $cur_year = $request->input('cur_year');
        $cal_cohort = $request->input('cal_cohort');
        $cal_category = $request->input('cal_category');

        $obj = mis_std_curAcademic::select(
            //table aca_cal_category
            'mis_std_info.sti_name',
            'mis_std_info.sti_icno',
            'mis_std_info.status_academic',
            'mis_std_info.sti_gender',
            'mis_std_info.recordstatus',
            //table aca_cal_category
            'mis_prm_calendar.cal_category',
            'mis_prm_calendar.cur_year',
            'mis_prm_calendar.cal_cohort',
            //table aca_cal_category
            'aca_cal_category.category',
            'mis_std_curAcademic.*'
        )
        ->leftJoin('mis_std_info', 'mis_std_info.std_studentid', '=', 'mis_std_curAcademic.std_studentid')
        ->leftJoin('mis_prm_calendar', 'mis_prm_calendar.cal_id', '=', 'mis_std_curAcademic.fk_acaCal')
        ->leftJoin('aca_cal_category', 'aca_cal_category.pk_id', '=', 'mis_prm_calendar.cal_category')
        ->where('mis_prm_calendar.cur_year',  $cur_year )// '2022/2023'
        ->where('mis_prm_calendar.cal_cohort', $cal_cohort) // 1
        ->where('mis_prm_calendar.cal_category', $cal_category) // 3
        ->where('mis_std_curAcademic.recordstatus', '!=', 'DEL')
        ->where('mis_std_info.recordstatus', '!=', 'DEL')
        ->orderBy('mis_std_curAcademic.std_studentid')
        ->get();
        // dd($obj);
        if ($obj){
            return response()->json([
                'success'=>'true',
                'message'=>'List Success!',
                'data'=>$obj
            ],200);
        }
       
    }

    public function reportListStudentLoc(Request $request){
        $cur_year = $request->input('cur_year');
        $cal_cohort = $request->input('cal_cohort');
        $cal_category = $request->input('cal_category');
        $fk_venue = $request->input('tbl_venue');

        $obj = DB::table('mis_exam_student')
        ->select(
            'mis_std_info.sti_name',
            'mis_exam_student.std_studentid',
            'mis_std_info.sti_icno',
            'mis_std_info.pgm_id',
            'mis_std_info.cur_intake',
            'mis_exam_timetable.tbl_date_start',
            'mis_exam_timetable.tbl_time_start',
            'mis_std_regsubject.crs_code',
            'mis_std_regsubject.fk_cotDet',
            'mis_exam_student.est_tableno',
            'mis_exam_center.cen_name',
            'mis_prm_college.clg_name',
            'mis_exam_center.cen_id',
            // 'mis_lecturer_course_prm.emp_id',
            'mis_prm_calendar.cur_year',
            'mis_prm_calendar.cal_cohort',
            'mis_prm_calendar.cal_category',
            'aca_cal_category.category',
            'mis_prm_course.crs_code as pk_course',
            'mis_prm_course.crs_name',
            // 'hrm_emp_info.emp_name'
        )
        ->leftJoin('mis_std_info', 'mis_exam_student.std_studentid', '=', 'mis_std_info.std_studentid')
        ->leftJoin('mis_std_regsubject', 'mis_exam_student.fk_stdRegCrs', '=', 'mis_std_regsubject.rsb_id')
        ->leftJoin('mis_prm_calendar', 'mis_std_regsubject.aca_session', '=', 'mis_prm_calendar.cal_id')
        ->leftJoin('mis_exam_center', 'mis_exam_student.fk_center', '=', 'mis_exam_center.pk_id')
        ->leftJoin('mis_prm_college', 'mis_exam_center.clg_id', '=', 'mis_prm_college.pk_id')
        // ->leftJoin('mis_lecturer_course_prm', 'mis_lecturer_course_prm.fk_cotDet', '=', 'mis_std_regsubject.fk_cotDet')
        ->leftJoin('aca_cal_category', 'aca_cal_category.pk_id', '=', 'mis_prm_calendar.cal_category')
        ->leftJoin('mis_prm_course', 'mis_prm_course.pk_id', '=', 'mis_std_regsubject.crs_code')
        // ->leftJoin('hrm_emp_info', 'hrm_emp_info.emp_id', '=', 'mis_lecturer_course_prm.emp_id')
        ->leftJoin('mis_exam_timetable', 'mis_exam_student.fk_exam', '=', 'mis_exam_timetable.pk_id')
        ->where('mis_prm_calendar.cur_year', $cur_year)
        ->where('mis_prm_calendar.cal_cohort', $cal_cohort)
        ->where('mis_prm_calendar.cal_category', $cal_category)
        ->where('mis_exam_student.fk_center', $fk_venue)
        // ->where('mis_std_info.sti_name', 'NOOR-UL-HUDA BINTI IMRAN JAVED')
        ->where('mis_std_regsubject.rsb_type','!=', 'CT')
        ->where('mis_exam_student.recordstatus','!=', 'DEL')
        // ->where('mis_prm_course.crs_code', 'CFE1712')
        ->orderBy('mis_exam_timetable.tbl_date_start')
        ->orderBy('mis_exam_timetable.tbl_time_start')
        ->orderBy('mis_exam_student.est_tableno', 'ASC')
        ->get();
        // dd($obj);

        $obj2 = DB::table('mis_exam_student')
            ->leftJoin('mis_std_regsubject', 'mis_exam_student.fk_stdRegCrs', '=', 'mis_std_regsubject.rsb_id')
            ->leftJoin('mis_prm_calendar', 'mis_std_regsubject.aca_session', '=', 'mis_prm_calendar.cal_id')
            ->leftJoin('mis_exam_center', 'mis_exam_student.fk_center', '=', 'mis_exam_center.pk_id')
            ->leftJoin('mis_prm_college', 'mis_exam_center.clg_id', '=', 'mis_prm_college.pk_id')
            ->leftJoin('aca_cal_category', 'aca_cal_category.pk_id', '=', 'mis_prm_calendar.cal_category')
            ->leftJoin('mis_prm_course', 'mis_prm_course.pk_id', '=', 'mis_std_regsubject.crs_code')
            ->leftJoin('mis_exam_timetable', 'mis_exam_timetable.pk_id', '=', 'mis_exam_student.fk_exam')
            ->select(
                'mis_exam_center.cen_name',
                'mis_prm_college.clg_name',
                'mis_exam_center.cen_id',
                'mis_prm_calendar.cur_year',
                'mis_prm_calendar.cal_cohort',
                'aca_cal_category.category',
                'mis_exam_timetable.tbl_date_start'
            )
            ->where('mis_prm_calendar.cur_year', $cur_year)
            ->where('mis_prm_calendar.cal_cohort', $cal_cohort)
            ->where('mis_prm_calendar.cal_category', $cal_category)
            ->where('mis_exam_student.fk_center', $fk_venue)
          
            ->groupBy(
                'mis_exam_center.cen_name',
                'mis_prm_college.clg_name',
                'mis_exam_center.cen_id',
                'mis_prm_calendar.cur_year',
                'mis_prm_calendar.cal_cohort',
                'aca_cal_category.category',
                'mis_exam_timetable.tbl_date_start'
            )
         
            ->first();

        // You can then use $result as needed, for example, iterate through it to access the data.

    

        // dd($obj);
        if ($obj){
            return response()->json([
                'success'=>'true',
                'message'=>'List Success!',
                'data'=>$obj,
                'data2'=>$obj2
            ],200);
        }
       
    }

    public function uptRelease(Request $request){
        $pk_cur_academic = $request->input('pk_cur_academic');
        $std_release = $request->input('std_release');
        $std_remarks = null;

        if($std_release != "checked"){
            $std_remarks = 'EXAM RESULT IS BLOCKED';
        }
        $obj = mis_std_curAcademic::where('pk_cur_academic',$pk_cur_academic)
        ->update([
            'std_remarks' => $std_remarks,
            'std_release' => $std_release
        ]);

        if ($obj){
            return response()->json([
                'success'=>true,
                'message'=>'Update Success!',
                'data'=>$obj
            ],200);
        }
        else{
            return response()->json([
                'success'=>false,
                'message'=>'Update Failed!',
                'data'=>$obj
            ],400);
        }
    }


    public function checkingSts($std_studentid, $curAcademic_type){

     
        $obj = mis_std_curAcademic::
        where([
            ['std_studentid',$std_studentid],
            ['curAcademic_type','=',$curAcademic_type],
            ['recordstatus','!=','DEL']
            ])
        ->get();

        if (sizeof($obj)>0){
            return response()->json([
                'success'=>true,
                'message'=>'Data Twitter',
                'data'=>$obj
            ],200);
        }
        else{
            return response()->json([
                'success'=>false,
                'message'=>'No data!',
                'data'=>''
            ],400);
        }
    }



    public function checkingStsDeferred($std_studentid, $fk_acaCal){

     
        $obj = mis_std_curAcademic::
        where([
            ['std_studentid',$std_studentid],
            ['curAcademic_type','=','Deferred'],
            ['fk_acaCal','=',$fk_acaCal],
            ['recordstatus','!=','DEL']
            ])
        ->get();

        if (sizeof($obj)>0){
            return response()->json([
                'success'=>true,
                'message'=>'Data Twitter',
                'data'=>$obj
            ],200);
        }
        else{
            return response()->json([
                'success'=>false,
                'message'=>'No data!',
                'data'=>''
            ],400);
        }
    }

     //function log
     private function logAudit($data){
        $obj = log::create($data);
    }



     public function reportingAuditBergraduat(Request $request){

        $fac_id = $request->input('fac_id');
        // dd($fac_id);
        $cal_category = $request->input('cal_category');
        $pgm_id = $request->input('pgm_id');

        $query = '
            SELECT
                main_query.pk_cur_academic,
                main_query.fk_acaCal,
                main_query.cal_category,
                main_query.category,
                main_query.pgm_fk,
                main_query.pgm_id,
                main_query.pgm_category,
                main_query.pgm_tcrdpass,
                main_query.pgm_mqflevel,
                main_query.status_academic,
                main_query.cam_id,
                main_query.std_studentid,
                main_query.sti_name,
                main_query.sti_icno,
                main_query.student_intake,
                main_query.student_intakeSession,
                main_query.latest_sem,
                main_query.std_gpa,
                main_query.std_cgpa,
                main_query.std_cect,
                main_query.lastupdateon,
                main_query.lastupdateby,
                main_query.lastapproveon,
                main_query.recordstatus,
                main_query.tc,
                main_query.tcp,
                main_query.tgp,
                main_query.cur_year,
                main_query.duration_std,
                main_query.fac_name,
                main_query.sta_muet,
                main_query.sta_muet_name,
                main_query.sta_bm_spm,
                main_query.cect_id,
                main_query.std_transkrip,
                main_query.std_credit_hour_pre,
                main_query.cect_type,
                sub_query.tc_sum,
                sub_query.tcp_sum,
                sub_query.tgp_sum,
                ROUND(course_query.tc_real, 2) AS tc_real,
                ROUND(course_queryCE.TC_CE, 2) AS TC_CE
                
            FROM
                (
                
                    SELECT
                        pk_cur_academic,
                        mis_std_curAcademic.fk_acaCal,
                        mis_prm_calendar.cal_category,
                        aca_cal_category.category,
                        mis_std_info.pgm_fk,
                        mis_std_info.pgm_id,
                        mis_std_info.status_academic,
                        mis_prm_programme.pgm_category,
                        mis_prm_programme.pgm_tcrdpass,
                        mis_prm_programme.pgm_mqflevel,
                        mis_prm_programme.fac_id,
                        mis_std_info.cam_id,
                        mis_std_curAcademic.std_studentid,
                        mis_std_info.sti_name,
                        mis_std_info.sti_icno,
                        mis_std_info.cur_intake as student_intake,
                        mis_std_info.sti_session_id as student_intakeSession,
                        mis_std_curAcademic.std_semester as latest_sem,
                        std_gpa,
                        std_cgpa,
                        std_cect,
                        mis_std_curAcademic.lastupdateon,
                        mis_std_curAcademic.lastupdateby,
                        mis_std_curAcademic.lastapproveon,
                        mis_std_curAcademic.recordstatus,
                        tc,
                        tcp,
                        tgp,
                        mis_prm_calendar.cur_year,
                        duration_std,
                        mis_prm_faculty.fac_name,
                        mis_std_academic.sta_muet,
                        mis_muet.sta_muet_name,
                        mis_std_academic.sta_bm_spm,
                        mis_std_cect.id as cect_id,
                        mis_std_cect.std_transkrip,
                        sum(mis_std_cect_det.std_credit_hour_pre) as std_credit_hour_pre,
                        mis_std_cect_det.cect_type
                    FROM
                        mis_std_curAcademic
                    LEFT JOIN
                        mis_std_info ON mis_std_curAcademic.std_studentid = mis_std_info.std_studentid
                    LEFT JOIN
                        mis_prm_calendar ON mis_std_curAcademic.fk_acaCal = mis_prm_calendar.cal_id
                    LEFT JOIN
                        aca_cal_category ON mis_prm_calendar.cal_category = aca_cal_category.pk_id
                    LEFT JOIN
                        mis_prm_programme ON mis_std_info.pgm_fk = mis_prm_programme.pk_id
                    LEFT JOIN
                        mis_prm_faculty ON mis_prm_programme.fac_id = mis_prm_faculty.pk_id
                    LEFT JOIN
                        mis_std_academic ON mis_std_curAcademic.std_studentid = mis_std_academic.std_studentid
                    LEFT JOIN
                        mis_muet ON mis_muet.sta_muet_id = mis_std_academic.sta_muet
                    LEFT JOIN
                        mis_std_cect ON mis_std_cect.studentid = mis_std_curAcademic.std_studentid
                    LEFT JOIN
                        mis_std_cect_det ON mis_std_cect_det.fk_cect = mis_std_cect.id
                    WHERE
                        (mis_std_curAcademic.std_studentid, mis_std_curAcademic.std_semester) IN (
                            SELECT
                                std_studentid,
                                MAX(std_semester)
                            FROM
                                mis_std_curAcademic
                            WHERE
                                mis_std_curAcademic.recordstatus != "DEL"
                            GROUP BY
                                std_studentid
                        )
                        AND mis_std_info.recordstatus != "DEL"
                        AND mis_std_curAcademic.recordstatus != "DEL"
                        AND COALESCE(mis_std_cect.recordstatus, "") != "DEL"
                        AND COALESCE(mis_std_cect_det.recordstatus, "") != "DEL"
                    GROUP BY
                        pk_cur_academic,
                        mis_std_curAcademic.fk_acaCal,
                        mis_prm_calendar.cal_category,
                        aca_cal_category.category,
                        mis_std_info.pgm_fk,
                        mis_std_info.pgm_id,
                        mis_std_info.status_academic,
                        mis_std_info.cam_id,
                        mis_prm_programme.pgm_category,
                        mis_prm_programme.pgm_tcrdpass,
                        mis_prm_programme.pgm_mqflevel,
                        mis_std_curAcademic.std_studentid,
                        mis_std_info.sti_name,
                        mis_std_info.sti_icno,
                        mis_std_info.cur_intake ,
                        mis_std_info.sti_session_id ,
                        mis_std_curAcademic.std_semester ,
                        std_gpa,
                        std_cgpa,
                        std_cect,
                        mis_std_curAcademic.lastupdateon,
                        mis_std_curAcademic.lastupdateby,
                        mis_std_curAcademic.lastapproveon,
                        mis_std_curAcademic.recordstatus,
                        tc,
                        tcp,
                        tgp,
                        mis_prm_calendar.cur_year,
                        duration_std,
                        mis_prm_faculty.fac_name,
                        mis_std_academic.sta_muet,
                        mis_muet.sta_muet_name,
                        mis_std_academic.sta_bm_spm,
                        mis_std_curAcademic.std_studentid,
                        mis_std_cect.id,
                        mis_std_cect.std_transkrip,
                        mis_std_cect_det.cect_type
                ) AS main_query
            LEFT JOIN
                (
                 
        SELECT
        std_studentid,
        SUM(tc) AS tc_sum,
        SUM(tcp) AS tcp_sum,
        SUM(tgp) AS tgp_sum
    FROM
        mis_std_curAcademic
    WHERE
        mis_std_curAcademic.recordstatus != "DEL"
    GROUP BY
        std_studentid         
                ) AS sub_query ON main_query.std_studentid = sub_query.std_studentid

                   LEFT JOIN
        (
            SELECT
                mis_std_regsubject.std_studentid,
                ROUND(SUM(mis_prm_course.crs_credit), 2) AS tc_real
            FROM
                mis_std_regsubject
            LEFT JOIN
                mis_prm_course ON mis_prm_course.pk_id = mis_std_regsubject.crs_code
            WHERE
                mis_std_regsubject.recordstatus != "DEL"
                AND mis_prm_course.recordstatus != "DEL"
                AND mis_std_regsubject.rsb_status != "Drop"
                AND mis_std_regsubject.rsb_type != "CE"

            GROUP BY
                mis_std_regsubject.std_studentid
        ) AS course_query ON main_query.std_studentid = course_query.std_studentid
  
         LEFT JOIN
        (
            SELECT
                mis_std_regsubject.std_studentid,
                ROUND(SUM(mis_prm_course.crs_credit), 2) AS TC_CE
            FROM
                mis_std_regsubject
            LEFT JOIN
                mis_prm_course ON mis_prm_course.pk_id = mis_std_regsubject.crs_code
            WHERE
                mis_std_regsubject.recordstatus != "DEL"
                AND mis_prm_course.recordstatus != "DEL"
                AND mis_std_regsubject.rsb_status != "Drop"
                AND mis_std_regsubject.rsb_type = "CE"

            GROUP BY
                mis_std_regsubject.std_studentid
        ) AS course_queryCE ON main_query.std_studentid = course_queryCE.std_studentid

            WHERE
                main_query.recordstatus != "DEL"
                AND main_query.status_academic = 8
        ';

        $parameters = [];

        // if (!$pgm_id  && !$fac_id  && !$cal_category  ) {
        if (
            ($pgm_id == null || $pgm_id == "null" || $pgm_id == "undefined" || $pgm_id == "") && 
            ($fac_id == null || $fac_id == "null" || $fac_id == "undefined" || $fac_id == "") && 
            ($cal_category == null || $cal_category == "null" || $cal_category == "undefined" || $cal_category == "")
            ) 
            {
            // $query .= ' LIMIT 100';
            // $parameters = [];
            }
        
        if ($pgm_id != null && $pgm_id != "null" && $pgm_id != "undefined" && $pgm_id != "") {
            $query .= ' AND main_query.pgm_fk = ?';
            $parameters[] = $pgm_id;
        }
        
        if ($fac_id != null && $fac_id != "null" && $fac_id != "undefined" && $fac_id != "") {
            $query .= ' AND main_query.fac_id = ?';
            // $query .= ' AND main_query.cam_id = ?';
            $parameters[] = $fac_id;
        }
        
        if ($cal_category != null && $cal_category != "null" && $cal_category != "undefined" && $cal_category != "") {
            $query .= ' AND main_query.cal_category = ?';
            $parameters[] = $cal_category;
        }
        
        // Execute the query with parameters
        $obj = DB::select($query, $parameters);
        $count = count($obj);
        // dd($count);
        // if($obj){     
        

        $results = [];

        foreach ($obj as $student) {
            $student_id = $student->std_studentid;

            $latestAcaHistory = DB::table('mis_std_acaHistory')
            ->select('std_studentid', 'std_muet', 'pk_id')
            ->where('mis_std_acaHistory.std_studentid', $student_id)
            ->orderBy('pk_id', 'DESC')
            ->first();
        
        // Check if latestAcaHistory is null
        if ($latestAcaHistory) {
            $latestAcaHistoryQuery = DB::table('mis_std_acaHistory')
                ->select('std_studentid', 'std_muet', 'pk_id')
                ->where('pk_id', $latestAcaHistory->pk_id);
        } else {
            $latestAcaHistoryQuery = DB::table('mis_std_acaHistory')
                ->select(DB::raw('null as std_studentid, null as std_muet, null as pk_id'))
                ->whereRaw('1 = 0'); // This ensures it returns an empty result
        }
        

// Retrieve additional data from mis_std_curAcademic
$additionalData = DB::table('mis_std_curAcademic')
    ->leftJoin('mis_prm_calendar', 'mis_prm_calendar.cal_id', '=', 'mis_std_curAcademic.fk_acaCal')
    ->leftJoinSub($latestAcaHistoryQuery, 'latest_aca_history', function($join) {
        $join->on('mis_std_curAcademic.std_studentid', '=', 'latest_aca_history.std_studentid');
    })
    ->select(
        'cur_year AS last_cur_year',
        'cal_cohort AS last_cal_cohort',
        'std_semester AS last_std_semester',
        'latest_aca_history.std_muet AS muetLatest'
    )
    ->where('mis_std_curAcademic.recordstatus', '!=', 'DEL')
    ->where('mis_std_curAcademic.std_studentid', $student_id)
    ->orderBy('std_semester', 'DESC')
    ->first();
            // Combine data from $obj and $additionalData
            $results[] = [
                'pk_cur_academic' => $student->pk_cur_academic,
                'fk_acaCal' => $student->fk_acaCal,
                'cal_category' => $student->cal_category,
                'category' => $student->category,
                'pgm_fk' => $student->pgm_fk,
                'pgm_id' => $student->pgm_id,
                'pgm_category' => $student->pgm_category,
                'pgm_tcrdpass' => $student->pgm_tcrdpass,
                'pgm_mqflevel' => $student->pgm_mqflevel,
                'status_academic' => $student->status_academic,
                'cam_id' => $student->cam_id,
                'std_studentid' => $student->std_studentid,
                'sti_name' => $student->sti_name,
                'sti_icno' => $student->sti_icno,
                'student_intake' => $student->student_intake,
                'student_intakeSession' => $student->student_intakeSession,
                'latest_sem' => $student->latest_sem,
                'std_gpa' => $student->std_gpa,
                'std_cgpa' => $student->std_cgpa,
                'std_cect' => $student->std_cect,
                'lastupdateon' => $student->lastupdateon,
                'lastupdateby' => $student->lastupdateby,
                'lastapproveon' => $student->lastapproveon,
                'recordstatus' => $student->recordstatus,
                'tc' => $student->tc,
                'tcp' => $student->tcp,
                'tgp' => $student->tgp,
                'cur_year' => $student->cur_year,
                'duration_std' => $student->duration_std,
                'fac_name' => $student->fac_name,
                'sta_muet' => $student->sta_muet,
                'sta_muet_name' => $student->sta_muet_name,
                'sta_bm_spm' => $student->sta_bm_spm,
                'cect_id' => $student->cect_id,
                'std_transkrip' => $student->std_transkrip,
                'std_credit_hour_pre' => $student->std_credit_hour_pre,
                'cect_type' => $student->cect_type,
                'tc_sum' => $student->tc_sum,
                'tcp_sum' => $student->tcp_sum,
                'tgp_sum' => $student->tgp_sum,
                'tc_real' => $student->tc_real,
                'TC_CE' => $student->TC_CE,
                
                'last_cur_year' => $additionalData->last_cur_year ?? null,
                'last_cal_cohort' => $additionalData->last_cal_cohort ?? null,
                'last_std_semester' => $additionalData->last_std_semester ?? null,
                'muetLatest' => $additionalData->muetLatest ?? null,
                
            ];
        }

        if(sizeof($obj) > 0){           
            return response()->json([
                'success'=>true,
                'messages'=>'List Found',
                'count'=>$count,
                // 'data'=>$obj,
                'data'=>$results,

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

     public function auditBergraduat(Request $request){

        $year = $request->input('year');
        $cohort = $request->input('cohort');
        $cal_category = $request->input('cal_category');
        $fac_id = $request->input('fac_id');
        $pgm_id = $request->input('pgm_id');
        $intake_id = $request->input('intake_id');
        $cam_id = $request->input('clg_id');
        
        $latestRecord = mis_prm_calendar::where('mis_prm_calendar.recordstatus', '!=', 'DEL')
            ->orderBy('mis_prm_calendar.cal_id', 'desc')
            ->first(['mis_prm_calendar.cur_year', 'mis_prm_calendar.cal_cohort']);

        $obj = DB::table('mis_std_info')
        ->select(
            'mis_std_info.std_studentid',
            'mis_std_info.sti_icno',
            'mis_std_info.sti_name',
            'mis_std_info.sti_gender',
            'mis_std_info.sti_nationality',
            'mis_std_info.pgm_fk',
            'mis_std_info.pgm_id',
            'mis_std_info.perms_facGrad',
            'mis_std_info.perms_facGrad_verifier',
            'mis_std_info.perms_facGrad_verifyDate',
            'mis_prm_programme.pgm_name',
            'mis_std_info.cam_id',
            'mis_std_info.cur_intake',
            'intake.id AS intake_id',
            DB::raw('SUBSTRING(mis_std_info.cur_intake, 1, 3) AS intake_month'),
            DB::raw('SUBSTRING(mis_std_info.cur_intake, 5, 4) AS intake_year'),
            'merged_info.dtp_id_merged',
            'merged_info.fk_acaCal_merged',
            'mis_prm_calendar.cur_year',
            'mis_prm_calendar.cal_cohort',
            'mis_prm_calendar.cal_category',
            'aca_cal_category.category',
            'mis_prm_college.clg_name',
            'mis_std_info.cam_id',
            'mis_prm_programme.fac_id',
            'mis_prm_faculty.fac_name'

        )
        ->leftJoin('intake', function ($join) {
            $join->on(DB::raw('SUBSTRING(mis_std_info.cur_intake, 1, 3)'), '=', 'intake.intake_name')
                ->on(DB::raw('SUBSTRING(mis_std_info.cur_intake, 5, 4)'), '=', 'intake.intake_year');
        })
        ->leftJoin('mis_prm_programme', 'mis_prm_programme.pk_id', '=', 'mis_std_info.pgm_fk')
        ->leftJoin(DB::raw('(SELECT 
                    mis_std_info.std_studentid,
                    (SELECT 
                        mis_prm_programme_det.dtp_id
                    FROM 
                        mis_prm_programme_det
                    LEFT JOIN 
                        mis_prm_curyear ON mis_prm_curyear.id = mis_prm_programme_det.fk_sesIntake
                    LEFT JOIN 
                        intake ON intake.id = mis_prm_curyear.cur_intake
                    WHERE 
                        mis_prm_programme_det.pgm_id = mis_std_info.pgm_fk
                        AND intake_name = SUBSTRING(mis_std_info.cur_intake, 1, 3)
                        AND intake_year = SUBSTRING(mis_std_info.cur_intake, 5, 4)
                        AND mis_prm_programme_det.recordstatus != "DEL"
                    ORDER BY 
                        dtp_id DESC
                    LIMIT 1) AS dtp_id_merged,
                    (SELECT 
                        mis_prm_curyear.fk_acaCal
                    FROM 
                        mis_prm_programme_det
                    LEFT JOIN 
                        mis_prm_curyear ON mis_prm_curyear.id = mis_prm_programme_det.fk_sesIntake
                    LEFT JOIN 
                        intake ON intake.id = mis_prm_curyear.cur_intake
                    WHERE 
                        mis_prm_programme_det.pgm_id = mis_std_info.pgm_fk
                        AND intake_name = SUBSTRING(mis_std_info.cur_intake, 1, 3)
                        AND intake_year = SUBSTRING(mis_std_info.cur_intake, 5, 4)
                        AND mis_prm_programme_det.recordstatus != "DEL"
                    ORDER BY 
                        dtp_id DESC
                    LIMIT 1) AS fk_acaCal_merged
                FROM
                    mis_std_info
                WHERE
                    mis_std_info.recordstatus != "DEL") AS merged_info'), 'mis_std_info.std_studentid', '=', 'merged_info.std_studentid')
        ->leftJoin('mis_prm_calendar', 'mis_prm_calendar.cal_id', '=', 'merged_info.fk_acaCal_merged')
        ->leftJoin('mis_prm_college', 'mis_prm_college.pk_id', '=', 'mis_std_info.cam_id')
        ->leftJoin('aca_cal_category', 'aca_cal_category.pk_id', '=', 'mis_prm_calendar.cal_category')
        ->leftJoin('mis_prm_faculty', 'mis_prm_faculty.pk_id', '=', 'mis_prm_programme.fac_id')
        ->where('mis_std_info.recordstatus', '!=', 'DEL')
        // ->where('mis_std_info.status_academic', '=', 1)
        ->where(function($query) {
            $query->where('mis_std_info.status_academic', '=', 1)
                  ->orWhere('mis_std_info.status_academic', '=', 9);
        })
        ;
        
        

        // if(($year != null && $year != "null" && $year != "undefined" && $year != "")){
        //     // DD($month);
        //     $obj = $obj->where('mis_prm_calendar.cur_year', $year)
        //     ;
        //     if(($cohort != null && $cohort != "null" && $cohort != "undefined" && $cohort != "")) {
        //         $obj->where('mis_prm_calendar.cal_cohort', $cohort);
        //     }
        // }
        
        if(($intake_id != null && $intake_id != "null" && $intake_id != "undefined" && $intake_id != "")){
            $obj->where('intake.id', $intake_id);
        }
        else{
            $obj = $obj->where('mis_prm_calendar.cur_year', $latestRecord-> cur_year) ;
            $obj->where('mis_prm_calendar.cal_cohort', $latestRecord -> cal_cohort);
        }

        if(($cal_category != null && $cal_category != "null" && $cal_category != "undefined" && $cal_category != "")){
            $obj->where('mis_prm_calendar.cal_category', $cal_category);
        }
        if(($cal_category != null && $cal_category != "null" && $cal_category != "undefined" && $cal_category != "")){
            $obj->where('mis_prm_calendar.cal_category', $cal_category);
        }
  
        if(($fac_id != null && $fac_id != "null" && $fac_id != "undefined" && $fac_id != "")){
            $obj->where('mis_prm_programme.fac_id', '=', $fac_id);
        }
        
        if(($pgm_id != null && $pgm_id != "null" && $pgm_id != "undefined" && $pgm_id != "")){
            $obj->where('mis_std_info.pgm_fk', $pgm_id);
        }
        
        $obj = $obj->orderBy('mis_prm_calendar.cur_year','ASC');
        $obj = $obj->orderBy('mis_prm_calendar.cal_cohort','ASC');
        // $obj = $obj->limit(3);
        $obj = $obj->get();

        $count = $obj->count();

        
                 
        if(sizeof($obj) > 0){           
            return response()->json([
                'success'=>true,
                'messages'=>'List Found',
                'count'=>$count,
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

     public function curAcademicSession(Request $request){
        $cur_year = $request->input('cur_year');
        $cal_cohort = $request->input('cal_cohort');
        $cam_id = $request->input('cam_id');

        $obj = mis_std_curAcademic::
        join('mis_std_info', 'mis_std_info.std_studentid', '=', 'mis_std_curAcademic.std_studentid')
        ->join('mis_prm_calendar', 'mis_prm_calendar.cal_id', '=', 'mis_std_curAcademic.fk_acaCal')
        ->where('mis_prm_calendar.cur_year', '=', $cur_year)
        ->where('mis_prm_calendar.cal_cohort', '=', $cal_cohort)
        ->where('mis_std_info.cam_id', '=', $cam_id)
        ->get([
            'mis_std_curAcademic.pk_cur_academic',
            'mis_std_curAcademic.std_studentid',
            'mis_std_info.sti_name',
            'mis_std_info.sti_icno',
            'mis_std_info.cur_intake',
            'mis_prm_calendar.cur_year',
            'mis_prm_calendar.cal_cohort',
            'mis_std_curAcademic.std_semester',
            'mis_std_info.sti_gender',
            'mis_std_info.status_academic'
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
            ],400);
        } 
     }





     public function lastSem($matrices){
        $obj = mis_std_curAcademic::where([['std_studentid','=',$matrices],
                ['mis_std_curAcademic.recordstatus','!=','DEL']
                ]) 
            ->leftjoin('mis_prm_calendar', 'mis_prm_calendar.cal_id','=','mis_std_curAcademic.fk_acaCal')
            ->orderBy('std_semester', 'DESC') 
            ->first([
                'pk_cur_academic',
                'std_semester',
                'fk_acaCal',
                'curAcademic_type',
                'cur_year',
                'cal_cohort',
                'std_gpa',
                'std_cgpa',
                'std_remarks',
                'std_release',
                'std_senate_endorsement', 
                'cal_status', 
                'mis_prm_calendar.cal_category',
                'mis_std_curAcademic.acaCal_weeks'

            ]);

        if($obj){
            return response()->json([
                'success'=>true,
                'message'=>"Papar Berjaya!",
                'data' => $obj
            ],200);
        }
        else{
            return response()->json([
                'success'=>false,
                'message'=>"Papar Gagal!",
                'data'=>''
            ],404);
        }
    }
}