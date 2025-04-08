<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use App\Models\hep_counselling;

class hep_counsellingController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }
    
    public function register(Request $request){
        $clg_id = $request->input('clg_id');
        $staff_id = $request->input('staff_id');
        $counseling_type_ori = $request->input('counseling_type_ori');
        $counseling_type = $request->input('counseling_type');
        $counselling_reason = $request->input('counselling_reason');
        $stud_id = $request->input('stud_id');
        $counselling_status = $request->input('counselling_status');
        $requester = $request->input('requester');
        $remark_coun = $request->input('remark_coun');
        $recordstatus = $request->input('recordstatus');

        $obj = hep_counselling::create([
            'clg_id' => $clg_id,
            'staff_id' => $staff_id,
            'counseling_type_ori' => $counseling_type_ori,
            'counseling_type' => $counseling_type,
            'stud_id' => $stud_id,
            'counselling_status' => $counselling_status,
            'requester' => $requester,
            'recordstatus' => $recordstatus,
            'counselling_reason' => $counselling_reason, //FK_caun_type afiez 28sep2023
            'remark_coun' => $remark_coun, 

        ]);

        if($obj){
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


    public function show(Request $request)  {
        $fac_id = $request->input('id_aduan');

        $hep_counselling = hep_counselling::where('id_aduan',$fac_id)->first();

        if ($hep_counselling)   {
            return response()->json([
                'success'=>'true',
                'message'=>'Show Success!',
                'data'=>$hep_counselling
            ],200);
        }
    }


    public function list(){
        $obj = hep_counselling::where([['hep_counselling.recordstatus','!=','DEL']])
            ->leftjoin('mis_prm_college', 'mis_prm_college.pk_id','=','hep_counselling.clg_id')
            ->leftjoin('mis_std_info', 'mis_std_info.std_studentid','=','hep_counselling.stud_id')
            ->leftjoin('hep_caun_timetable', 'hep_caun_timetable.id_timetable','=','hep_counselling.coun_timeslot')
            ->leftjoin('hep_caun_kaunselor', 'hep_caun_kaunselor.pk_id','=','hep_counselling.counselling_kaunselor')
            ->leftjoin('hrm_emp_info AS empKaun', 'empKaun.emp_id','=','hep_caun_kaunselor.staff_name')
            ->leftjoin('hrm_emp_info AS empStaf', 'empStaf.emp_id','=','hep_counselling.staff_id')
            ->leftjoin('hep_caun_type', 'hep_caun_type.pk_id','=','hep_counselling.counselling_reason')
            ->get(
                [
                'counselling_id',
                'hep_counselling.clg_id AS clgId',
                'clg_name',
                'staff_id',
                'counseling_type_ori',
                'counseling_type',
                'stud_id',
                'sti_name',
                'counselling_reason',
                'requester',
                'counselling_status',
                'counselling_date',
                'hep_counselling.coun_timeslot AS fk_timeslot',
                'hep_caun_timetable.coun_timeslot AS timeSlot',
                'counselling_kaunselor',
                'empKaun.emp_name AS kaunName',
                'empStaf.emp_name AS applicant',
                // afiez tmbah 28 sep2023
                'hep_counselling.remark_coun', 
                'hep_caun_type.pk_id AS FK_type_reason',
                'hep_caun_type.id_jeniskaunseling AS code_FK_type',
                'hep_caun_type.description AS det_FK_type',
                'mis_std_info.sti_contactno_mobile'
            ]
        );

        if ($obj){
            return response()->json([
                'success'=>'true',
                'message'=>'List Success!',
                'data'=>$obj
            ],200);
        }
    }


    public function update(Request $request){
        $counselling_id = $request->input('counselling_id');
        $clg_id = $request->input('clg_id');
        $counseling_type = $request->input('counseling_type');
        $counselling_reason = $request->input('counselling_reason');
        $stud_id = $request->input('stud_id');
        $recordstatus = $request->input('recordstatus');

        $obj = hep_counselling::where([['counselling_id','=',$counselling_id]]) ->update([
            'clg_id' => $clg_id,
            'counseling_type' => $counseling_type,
            'counselling_reason' => $counselling_reason,
            'stud_id' => $stud_id,
            'recordstatus' => $recordstatus
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


    public function delete(Request $request){
        $recordstatus = $request->input('recordstatus');
        $counselling_id = $request->input('counselling_id');

        $obj = hep_counselling::where('counselling_id',$counselling_id)-> update([
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


    public function listByStd($id){
        $obj = hep_counselling::where([['hep_counselling.stud_id','=',$id],['hep_counselling.recordstatus','!=','DEL']])
            ->leftjoin('hep_caun_kaunselor', 'hep_caun_kaunselor.pk_id', '=', 'hep_counselling.counselling_kaunselor')
            ->leftjoin('hep_caun_type', 'hep_caun_type.pk_id','=','hep_counselling.counselling_reason')
            ->leftjoin('hrm_emp_info', 'hrm_emp_info.emp_id','=','hep_caun_kaunselor.staff_name')
            ->leftjoin('mis_prm_college', 'mis_prm_college.pk_id','=','hep_counselling.clg_id')
            ->leftjoin('hep_caun_timetable', 'hep_caun_timetable.id_timetable','=','hep_counselling.coun_timeslot')
            ->leftjoin('mis_std_info', 'mis_std_info.std_studentid','=','hep_counselling.stud_id')
            ->get(
                [
                'counselling_id',
                'hep_counselling.clg_id AS camId',
                'clg_name',
                'counseling_type_ori',
                'counselling_date',
                'counselling_reason',
                'counselling_status',
                'counselling_kaunselor',
                'emp_name',
                'requester',
                'hep_counselling.coun_timeslot AS fk_timeslot',
                'hep_caun_timetable.coun_timeslot AS timeSlot',
                'staff_id',
                'counseling_type',
                'stud_id',
                'sti_name',
            'hep_caun_type.pk_id as FK_type_caun', //afiez tmbah utk tarik fk reason/ issue
            'hep_caun_type.id_jeniskaunseling as FK_type_caun_code',
            'hep_caun_type.description as FK_type_caun_det',
            'hep_counselling.remark_coun',
            ]
        );

        if ($obj){
            return response()->json([
                'success'=>'true',
                'message'=>'List Success!',
                'data'=>$obj
            ],200);
        }
    }


    // student apply counseling
    public function stdRegister(Request $request){
        $clg_id = $request->input('clg_id');
        $stud_id = $request->input('stud_id');
        $requester = $request->input('requester');
        $counselling_kaunselor = $request->input('counselling_kaunselor');
        $counselling_date = $request->input('counselling_date');
        $coun_timeslot = $request->input('coun_timeslot');
        $counselling_reason = $request->input('counselling_reason');
        $remark_coun = $request->input('remark_coun');
        $counselling_status = $request->input('counselling_status');
        $counseling_type = $request->input('counseling_type');
        $recordstatus = $request->input('recordstatus');

        $obj = hep_counselling::create([
            'clg_id' => $clg_id,
            'stud_id' => $stud_id,
            'requester' => $requester,
            'counselling_kaunselor' => $counselling_kaunselor,
            'counselling_date' => $counselling_date,
            'coun_timeslot' => $coun_timeslot,
            'counselling_reason' => $counselling_reason,
            'remark_coun' => $remark_coun,
            'counselling_status' => $counselling_status,
            'counseling_type' => $counseling_type,
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


    // student update counseling
    public function uptStd(Request $request){
        $counselling_id = $request->input('counselling_id');
        $clg_id = $request->input('clg_id');
        $counselling_reason = $request->input('counselling_reason');
        $remark_coun = $request->input('remark_coun');
        $counselling_kaunselor = $request->input('counselling_kaunselor');
        $counselling_date = $request->input('counselling_date');
        $coun_timeslot = $request->input('coun_timeslot');
        $recordstatus = $request->input('recordstatus');

        $obj = hep_counselling::where([['counselling_id','=',$counselling_id]]) ->update([
            'clg_id' => $clg_id,
            'counselling_reason' => $counselling_reason,
            'counselling_kaunselor' => $counselling_kaunselor,
            'counselling_date' => $counselling_date,
            'coun_timeslot' => $coun_timeslot,
            'remark_coun' => $remark_coun,
            'recordstatus' => $recordstatus
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


    // update status by Counselor
    public function uptStatus(Request $request){
        $counselling_id = $request->input('counselling_id');
        $counselling_status = $request->input('counselling_status');
        $counselling_kaunselor = $request->input('counselling_kaunselor');
        $counselling_date = $request->input('counselling_date');
        $coun_timeslot = $request->input('coun_timeslot');
        $alert = $request->input('alert');
        $recordstatus = $request->input('recordstatus');

        $obj = hep_counselling::where([['counselling_id','=',$counselling_id]]) ->update([
            'counselling_status' => $counselling_status,
            'counselling_kaunselor' => $counselling_kaunselor,
            'counselling_date' => $counselling_date,
            'coun_timeslot' => $coun_timeslot,
            'alert' => $alert,
            'recordstatus' => $recordstatus
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


    // get application counseling for kaunselor
    public function findByTime($id){
        $obj = hep_counselling::where([['coun_timeslot', $id],['counselling_status', 'Accept'],['recordstatus','!=','DEL']]) ->get(['counselling_id']);

        if($obj){
            return response()->json([
                'success'=>'true',
                'message'=>'List Success!',
                'data'=>$obj
            ],200);
        }
    }


    // count application by Counselor
    public function alertByKaun($id){
        $obj = hep_counselling::where([['staff_id', $id],['alert', 1],['recordstatus','!=','DEL']]) ->get(['counselling_id']);

        if($obj){
            return response()->json([
                'success'=>'true',
                'message'=>'List Success!',
                'data'=>$obj
            ],200);
        }
    }


    // count application by Student status==Accept
    public function alertStdAccpt($id){
        $obj = hep_counselling::where([['stud_id', $id],['counselling_status', 'Accept'],['recordstatus','!=','DEL']]) ->get(['counselling_id']);

        if($obj){
            return response()->json([
                'success'=>'true',
                'message'=>'List Success!',
                'data'=>$obj
            ],200);
        }
    }


    // list by staff apply
    public function listByStaf($id){
        $obj = hep_counselling::where([['hep_counselling.staff_id','=',$id],['hep_counselling.recordstatus','!=','DEL']])
            ->leftjoin('hep_caun_kaunselor', 'hep_caun_kaunselor.pk_id', '=', 'hep_counselling.counselling_kaunselor')
            ->leftjoin('hrm_emp_info', 'hrm_emp_info.emp_id','=','hep_caun_kaunselor.staff_name')
            ->leftjoin('mis_prm_college', 'mis_prm_college.pk_id','=','hep_counselling.clg_id')
            ->leftjoin('hep_caun_timetable', 'hep_caun_timetable.id_timetable','=','hep_counselling.coun_timeslot')
            ->leftjoin('mis_std_info', 'mis_std_info.std_studentid','=','hep_counselling.stud_id')
            ->get([
                'counselling_id',
                'hep_counselling.clg_id AS camId',
                'clg_name',
                'counselling_date',
                'counselling_reason',
                'counselling_status',
                'counselling_kaunselor',
                'emp_name',
                'requester',
                'hep_counselling.coun_timeslot AS fk_timeslot',
                'hep_caun_timetable.coun_timeslot AS timeSlot',
                'staff_id',
                'counseling_type',
                'stud_id',
                'sti_name',
                'alert'
            ]);

        if($obj){
            return response()->json([
                'success'=>'true',
                'message'=>'List Success!',
                'data'=>$obj
            ],200);
        }
    }


    // alert counseling status==New
    public function alertCounNew(){
        $obj = hep_counselling::where([['counselling_status', 'New'],['recordstatus','!=','DEL']]) 
            ->orWhere([['counselling_status', 'Accept'],['recordstatus','!=','DEL']]) 
            ->orWhere([['alert', 1],['recordstatus','!=','DEL']]) 
            ->get(['counselling_id']);

        if($obj){
            return response()->json([
                'success'=>'true',
                'message'=>'List Success!',
                'data'=>$obj
            ],200);
        }
    }


    // update alert
    public function uptAlert(Request $request){
        $counselling_id = $request->input('counselling_id');
        $alert = $request->input('alert');
        $recordstatus = $request->input('recordstatus');

        $obj = hep_counselling::where([['counselling_id','=',$counselling_id]]) ->update([
            'alert' => $alert,
            'recordstatus' => $recordstatus
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

    // utk generate report by adlina_020824
    public function generatePDF(Request $request)
    {
        $dateKaunselor = $request->input('dateKaunselor');
    
        if ($dateKaunselor) {
            $dateParts = explode('-', $dateKaunselor);
            $year = $dateParts[0];
            $month = $dateParts[1];
        } else {
            $year = null;
            $month = null; 
        }
    
        $obj = hep_counselling::where('hep_counselling.recordstatus', '!=', 'DEL')
            ->leftJoin('hep_caun_type', 'hep_caun_type.pk_id', '=', 'hep_counselling.counselling_reason');
    
        if ($month) {
            $obj->whereMonth('hep_counselling.lastapproveon', '=', $month);
        }
        if ($year) {
            $obj->whereYear('hep_counselling.lastapproveon', '=', $year);
        }
    
        $obj = $obj->get([
            'counselling_id',
            'hep_caun_type.pk_id AS FK_type_reason',
            'hep_caun_type.description AS det_FK_type'
        ]);
    
        if ($obj->isNotEmpty()) {
            // Use the groupBy and count methods to count occurrences
            $counts = $obj->groupBy('det_FK_type')->map->count();
    
            return response()->json([
                'success' => 'true',
                'message' => 'List Success!',
                'data' => $counts,
            ], 200);
        }
        else{
            return response()->json([
                'success' => 'true',
                'message' => 'List Success!',
                'data' => '',
            ], 200);
        }
    
        return response()->json([
            'success' => 'false',
            'message' => 'No Data Found',
        ], 404);
    }
    
    // end utk generate report by afiez 28sep2023




    public function listByTimeTable($FK_timetable){
        $obj = hep_counselling::where([['hep_counselling.recordstatus','!=','DEL']])
            ->leftjoin('mis_prm_college', 'mis_prm_college.pk_id','=','hep_counselling.clg_id')
            ->leftjoin('mis_std_info', 'mis_std_info.std_studentid','=','hep_counselling.stud_id')
            ->leftjoin('hep_caun_timetable', 'hep_caun_timetable.id_timetable','=','hep_counselling.coun_timeslot')
            ->leftjoin('hep_caun_kaunselor', 'hep_caun_kaunselor.pk_id','=','hep_counselling.counselling_kaunselor')
            ->leftjoin('hrm_emp_info AS empKaun', 'empKaun.emp_id','=','hep_caun_kaunselor.staff_name')
            ->leftjoin('hrm_emp_info AS empStaf', 'empStaf.emp_id','=','hep_counselling.staff_id')
            ->leftjoin('hep_caun_type', 'hep_caun_type.pk_id','=','hep_counselling.counselling_reason')
            ->where('hep_caun_timetable.id_timetable','=',$FK_timetable)
                ->get(
                [
                'counselling_id',
                'hep_counselling.clg_id AS clgId',
                'clg_name',
                'staff_id',
                'counseling_type_ori',
                'counseling_type',
                'stud_id',
                'sti_name',
                'counselling_reason',
                'requester',
                'counselling_status',
                'counselling_date',
                'hep_counselling.coun_timeslot AS fk_timeslot',
                'hep_caun_timetable.coun_timeslot AS timeSlot',
                'counselling_kaunselor',
                'empKaun.emp_name AS kaunName',
                'empStaf.emp_name AS applicant',
                // afiez tmbah 28 sep2023
                'hep_counselling.remark_coun', 
                'hep_caun_type.pk_id AS FK_type_reason',
                'hep_caun_type.id_jeniskaunseling AS code_FK_type',
                'hep_caun_type.description AS det_FK_type'
            ]
        );

        if ($obj){
            return response()->json([
                'success'=>'true',
                'message'=>'List Success!',
                'data'=>$obj
            ],200);
        }
    }
}


       //     'hep_counselling.clg_id AS clgId',
            //     'clg_name',
            //     'staff_id',
            //     'counseling_type',
            //     'stud_id',
            //     'sti_name',
            //     'counselling_reason',
            //     'requester',
            //     'counselling_status',
            //     'counselling_date',
            //     'hep_counselling.coun_timeslot AS fk_timeslot',
            //     'hep_caun_timetable.coun_timeslot AS timeSlot',
            //     'counselling_kaunselor',
            //     'empKaun.emp_name AS kaunName',
            //     'empStaf.emp_name AS applicant',
            //     // afiez tmbah 28 sep2023
            //     'remark_coun', 

                // 'hep_caun_type.id_jeniskaunseling AS code_FK_type',
