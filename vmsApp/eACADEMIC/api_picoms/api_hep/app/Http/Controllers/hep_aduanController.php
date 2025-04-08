<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use App\Models\hep_aduan;

class hep_aduanController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }
    
    public function register(Request $request){
        $aduanUpload = '';
        if($request->hasFile('aduan_upload')){
            $file = $request->file('aduan_upload');
            $aduanUpload = time() . $file->getClientOriginalName();
            $file->move('aduan', $aduanUpload);
        }

        $clg_id = $request->input('clg_id');
        $stud_icno = $request->input('stud_icno');
        $aduan_type = $request->input('aduan_type');
        $aduan_venue = $request->input('aduan_venue');
        $aduan_remark = $request->input('aduan_remark');
        $aduan_date = $request->input('aduan_date');
        $aduan_status = $request->input('aduan_status');
        $recordstatus = $request->input('recordstatus');

        $obj = hep_aduan::create([
            'clg_id' => $clg_id,
            'stud_icno' => $stud_icno,
            'aduan_type' => $aduan_type,
            'aduan_venue' => $aduan_venue,
            'aduan_remark' => $aduan_remark,
            'aduan_date' => $aduan_date,
            'aduan_status' => $aduan_status,
            'aduan_upload' => $aduanUpload,
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


    public function show(Request $request){
        $fac_id = $request->input('id_aduan');

        $hep_aduanController = hep_aduanController::where('id_aduan',$fac_id)->first();

        if ($hep_aduanController)   {
            return response()->json([
                'success'=>'true',
                'message'=>'Show Success!',
                'data'=>$hep_aduanController
            ],200);
        }
    }


    public function list(){
        $obj = hep_aduan::where([['hep_aduan.recordstatus','!=','DEL']]) 
            ->leftjoin('hep_jenisaduan', 'hep_jenisaduan.pk_id','=','hep_aduan.aduan_type')
            ->leftjoin('mis_prm_college', 'mis_prm_college.pk_id','=','hep_aduan.clg_id')
            ->leftjoin('hrm_emp_info', 'hrm_emp_info.emp_id','=','hep_aduan.aduan_warden_assigned')
            ->get([
                'id_aduan',
                'hep_aduan.clg_id AS cam_id',
                'clg_name',
                'stud_icno',
                'aduan_type',
                'description',
                'aduan_venue',
                'aduan_status',
                'aduan_warden_assigned',
                'emp_name',
                'aduan_remark',
                'aduan_date',
                'aduan_warden_remark',
                'aduan_upload',
                'id_jenisaduan'
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
        $aduanUpload = $request->input('exist_aduan_upload');
        if($request->hasFile('aduan_upload')){
            $file = $request->file('aduan_upload');
            $aduanUpload = time() . $file->getClientOriginalName();
            $file->move('aduan', $aduanUpload);
        }

        $id_aduan = $request->input('id_aduan');
        $clg_id = $request->input('clg_id');
        $stud_icno = $request->input('stud_icno');
        $aduan_type = $request->input('aduan_type');
        $aduan_venue = $request->input('aduan_venue');
        $aduan_remark = $request->input('aduan_remark');
        $aduan_date = $request->input('aduan_date');
        $aduan_status = $request->input('aduan_status');
        $aduan_warden_assigned = $request->input('aduan_warden_assigned');
        $aduan_alert = $request->input('aduan_alert');
        $recordstatus = $request->input('recordstatus');

        $obj = hep_aduan::where([['id_aduan','=',$id_aduan]]) -> update([
            'clg_id' => $clg_id,
            'stud_icno' => $stud_icno,
            'aduan_type' => $aduan_type,
            'aduan_venue' => $aduan_venue,
            'aduan_remark' => $aduan_remark,
            'aduan_date' => $aduan_date,
            'aduan_status' => $aduan_status,
            'aduan_warden_assigned' => $aduan_warden_assigned,
            'aduan_upload' => $aduanUpload,
            'aduan_alert' => $aduan_alert,
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
        $id_aduan = $request->input('id_aduan');

        $obj = hep_aduan::where('id_aduan',$id_aduan)-> update([
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
    
    
    public function facultyCodeChecking(Request $request){
        $input = $request->input('input');
        // $cam_id = $request->input('cam_id');

        $obj = mis_prm_faculty::select('fac_id')->where([
            ['fac_id','=',$input],
            ['recordstatus','!=','DEL']
            ])
            // -> where('cam_id','=',$cam_id) 
            ->get();

        if ($obj)  {
            return response()->json([
                'success'=>true,
                'message'=>"Carian Berjaya!",
                'data' => $obj
            ],200);
        }
        else{
            return response()->json([
                'success'=>false,
                'message'=>"Carian Gagal!",
                'data'=>''
            ],404);
        }
    }

    public function listByCampus($id){
        $obj = mis_prm_faculty::SELECT('mis_prm_faculty.*','clg_name')
            -> join('mis_prm_college', 'mis_prm_college.pk_id', '=' , 'mis_prm_faculty.cam_id')
            -> where('mis_prm_faculty.cam_id', '=', $id)
            -> where([['mis_prm_faculty.recordstatus','!=','DEL']]) -> get();

        if ($obj)   {
            return response()->json([
                'success'=>'true',
                'message'=>'List Success!',
                'data'=>$obj
            ],200);
        }
    }


    public function countAlert(){
        $obj = hep_aduan::selectRaw('COUNT(id_aduan) AS totalAduan') 
            ->where([
                ['recordstatus','!=','DEL'],
                ['aduan_status','!=','Complete']
            ]) -> get();

        if ($obj){
            return response()->json([
                'success'=>'true',
                'message'=>'List Success!',
                'data'=>$obj
            ],200);
        }
    }


    // list by student
    public function listByStd($id){
        $obj = hep_aduan::where([['hep_aduan.stud_icno','=',$id],['hep_aduan.recordstatus','!=','DEL']])
            ->leftjoin('hep_jenisaduan', 'hep_jenisaduan.pk_id','=','hep_aduan.aduan_type')
            ->leftjoin('mis_prm_college', 'mis_prm_college.pk_id','=','hep_aduan.clg_id')
            ->leftjoin('hrm_emp_info', 'hrm_emp_info.emp_id','=','hep_aduan.aduan_warden_assigned')
            ->get([
                'id_aduan',
                'hep_aduan.clg_id AS cam_id',
                'clg_name',
                'stud_icno',
                'aduan_type',
                'description',
                'aduan_venue',
                'aduan_status',
                'aduan_warden_assigned',
                'emp_name',
                'aduan_remark',
                'aduan_date',
                'aduan_warden_remark',
                'aduan_upload',
                'aduan_alert'
            ]);

        if ($obj){
            return response()->json([
                'success'=>'true',
                'message'=>'List Success!',
                'data'=>$obj
            ],200);
        }
    }


    // update by student
    public function uptStd(Request $request){
        $aduanUpload = $request->input('exist_aduan_upload');
        if($request->hasFile('aduan_upload')){
            $file = $request->file('aduan_upload');
            $aduanUpload = time() . $file->getClientOriginalName();
            $file->move('aduan', $aduanUpload);
        }

        $id_aduan = $request->input('id_aduan');
        $clg_id = $request->input('clg_id');
        $aduan_type = $request->input('aduan_type');
        $aduan_venue = $request->input('aduan_venue');
        $aduan_remark = $request->input('aduan_remark');
        $aduan_date = $request->input('aduan_date');
        $recordstatus = $request->input('recordstatus');

        $obj = hep_aduan::where([['id_aduan','=',$id_aduan]]) -> update([
            'clg_id' => $clg_id,
            'aduan_type' => $aduan_type,
            'aduan_venue' => $aduan_venue,
            'aduan_remark' => $aduan_remark,
            'aduan_date' => $aduan_date,
            'aduan_upload' => $aduanUpload,
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


    // list by warden assigned
    public function listByStaf($id){
        $obj = hep_aduan::where([['hep_jenisaduan.id_jenisaduan','=',00],['hep_aduan.recordstatus','!=','DEL']])
            ->leftjoin('hep_jenisaduan', 'hep_jenisaduan.pk_id','=','hep_aduan.aduan_type')
            ->leftjoin('mis_prm_college', 'mis_prm_college.pk_id','=','hep_aduan.clg_id')
            ->leftjoin('hrm_emp_info', 'hrm_emp_info.emp_id','=','hep_aduan.aduan_warden_assigned')
            ->get([
                'id_aduan',
                'hep_aduan.clg_id AS cam_id',
                'clg_name',
                'stud_icno',
                'aduan_type',
                'description',
                'aduan_venue',
                'aduan_status',
                'aduan_warden_assigned',
                'emp_name',
                'aduan_remark',
                'aduan_date',
                'aduan_warden_remark',
                'aduan_upload',
                'id_jenisaduan'
            ]);

        if ($obj){
            return response()->json([
                'success'=>'true',
                'message'=>'List Success!',
                'data'=>$obj
            ],200);
        }
    }


    // list aduan umum
    public function listAduUmum(){
        $obj = hep_aduan::where([['hep_jenisaduan.id_jenisaduan','=',56],['hep_aduan.recordstatus','!=','DEL']])
            ->leftjoin('hep_jenisaduan', 'hep_jenisaduan.pk_id','=','hep_aduan.aduan_type')
            ->get(['id_aduan']);

        if ($obj){
            return response()->json([
                'success'=>'true',
                'message'=>'List Success!',
                'data'=>$obj
            ],200);
        }
    }


    // list aduan umum Complte
    public function listAduUmumCmplt(){
        $obj = hep_aduan::where([['hep_jenisaduan.id_jenisaduan','=',56],['hep_aduan.aduan_status','=','Complete'],['hep_aduan.recordstatus','!=','DEL']])
            ->leftjoin('hep_jenisaduan', 'hep_jenisaduan.pk_id','=','hep_aduan.aduan_type')
            ->get(['id_aduan']);

        if ($obj){
            return response()->json([
                'success'=>'true',
                'message'=>'List Success!',
                'data'=>$obj
            ],200);
        }
    }


    // list aduan kerosakan
    public function listKerosakan(){
        $obj = hep_aduan::where([['hep_jenisaduan.id_jenisaduan','=',00],['hep_aduan.recordstatus','!=','DEL']])
            ->leftjoin('hep_jenisaduan', 'hep_jenisaduan.pk_id','=','hep_aduan.aduan_type')
            ->get(['id_aduan']);

        if ($obj){
            return response()->json([
                'success'=>'true',
                'message'=>'List Success!',
                'data'=>$obj
            ],200);
        }
    }


    // list aduan kerosakan Complte
    public function listRosakCmplt(){
        $obj = hep_aduan::where([['hep_jenisaduan.id_jenisaduan','=',00],['hep_aduan.aduan_status','=','Complete'],['hep_aduan.recordstatus','!=','DEL']])
            ->leftjoin('hep_jenisaduan', 'hep_jenisaduan.pk_id','=','hep_aduan.aduan_type')
            ->get(['id_aduan']);

        if ($obj){
            return response()->json([
                'success'=>'true',
                'message'=>'List Success!',
                'data'=>$obj
            ],200);
        }
    }


    // alert for student status==Complete
    public function alertStdReport($id){
        $obj = hep_aduan::where([['stud_icno','=',$id],['aduan_alert','=',1],['recordstatus','!=','DEL']]) ->get(['id_aduan']);

        if($obj){
            return response()->json([
                'success'=>'true',
                'message'=>'List Success!',
                'data'=>$obj
            ],200);
        }
    }


    // update complete report by warden assigned
    public function uptComplete(Request $request){
        $id_aduan = $request->input('id_aduan');
        $aduan_status = $request->input('aduan_status');
        $aduan_warden_remark = $request->input('aduan_warden_remark');
        $aduan_alert = $request->input('aduan_alert');
        $recordstatus = $request->input('recordstatus');

        $obj = hep_aduan::where([['id_aduan','=',$id_aduan]]) ->update([
            'aduan_status' => $aduan_status,
            'aduan_warden_remark' => $aduan_warden_remark,
            'aduan_alert' => $aduan_alert,
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


    // update alert
    public function uptAlert(Request $request){
        $id_aduan = $request->input('id_aduan');
        $aduan_alert = $request->input('aduan_alert');
        $recordstatus = $request->input('recordstatus');

        $obj = hep_aduan::where([['id_aduan','=',$id_aduan]]) ->update([
            'aduan_alert' => $aduan_alert,
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



    
    public function viewKerosakan($idStudent){

        // clg = campus id
        $obj = hep_aduan::
            select(
                    // '*'
                    'id_aduan', 'stud_icno', 'hep_aduan.clg_id', 'aduan_type', 
                    'description', 'aduan_remark' ,'aduan_date', 'aduan_venue',
                    'aduan_warden_remark' ,'aduan_upload', 'aduan_alert','aduan_status',
                    'hep_aduan.recordstatus' , 'mis_prm_college.clg_name'
                    )
            ->leftjoin('hep_jenisaduan','hep_jenisaduan.pk_id','=', 'hep_aduan.aduan_type')
            ->leftjoin('mis_prm_college','mis_prm_college.pk_id','=', 'hep_aduan.clg_id')
            -> where([['hep_aduan.aduan_type','=',7],['hep_aduan.recordstatus','!=','DEL']])
            ->where('stud_icno',$idStudent)
            ->get(['id_aduan']);
        if ($obj){
            return response()->json([
                'success'=>'true',
                'message'=>'List Success!',
                'data'=>$obj
            ],200);
        }
    }

    public function listRosak(){

        // clg = campus id
        $obj = hep_aduan::
            select(
                    // '*'
                    'id_aduan', 'hep_aduan.stud_icno', 'hep_aduan.clg_id', 'aduan_type', 
                    'description', 'id_jenisaduan' , 'aduan_remark' ,'aduan_date', 'aduan_venue',
                    'aduan_warden_remark' ,'aduan_upload', 'aduan_alert','aduan_status',
                    'hep_aduan.recordstatus' , 'mis_prm_college.clg_name',

                    'sti_name','sti_icno'


                    )
            ->leftjoin('hep_jenisaduan','hep_jenisaduan.pk_id','=', 'hep_aduan.aduan_type')
            ->leftjoin('mis_prm_college','mis_prm_college.pk_id','=', 'hep_aduan.clg_id')
            ->leftjoin('mis_std_info','mis_std_info.std_studentid','=', 'hep_aduan.stud_icno')
            -> where([['hep_aduan.aduan_type','=',7],['hep_aduan.recordstatus','!=','DEL']])
            ->get(['id_aduan']);
        if ($obj){
            return response()->json([
                'success'=>'true',
                'message'=>'List Success!',
                'data'=>$obj
            ],200);
        }
    }
}
