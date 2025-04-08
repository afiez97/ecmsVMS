<?php

namespace App\Http\Controllers;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use App\Models\sad_users;
use App\Models\mis_std_info;
use App\Models\mis_std_curAcademic;
use Illuminate\Support\Facades\DB;

class mis_std_infoController_new extends Controller
{
    public function  __construct()
    {
        $this->middleware('auth');
    }
    
    public function create(Request $request){
        $std_studentid        = $request->input('std_studentid');
        $sti_name             = $request->input('sti_name');
        $sti_icno             = $request->input('sti_icno');
        $pgm_fk               = $request->input('pgm_fk');
        $pgm_id               = $request->input('pgm_id');
        $cur_intake           = $request->input('cur_intake');
        $sti_session_id       = $request->input('sti_session_id');
        $sti_nationality      = $request->input('sti_nationality');
        $cam_id               = $request->input('cam_id');
        $sti_email            = $request->input('sti_email');
        $sti_bridging         = $request->input('sti_bridging');
        $recordstatus         = "ADD";

        //GENERATE PASSWORD
        $salt = "RMY7nZ3+s8xpU1n0O*0o_EGfdoYtd|iU_AzhKCMoSu_xhh-e|~y8FOG*-xLZ";
        $password     = hash("sha256", $sti_icno.$salt);

        if($std_studentid == "" || $std_studentid == null){
            //GET CUR_INTAKE & SESSION
            $session_id = substr($cur_intake,6);
            $set_intake = date_format(date_create(substr($cur_intake,0,3)),'m');

            //SET NOSIRI
            $nosiri = "001";
            $obj = mis_std_info::select("nosiri")
            ->where('pgm_id',$pgm_id)
            ->where('cur_intake',$cur_intake)
            // ->where('sti_session_id',$sti_session_id)
            // ->where('cam_id',$cam_id)
            ->orderBy("nosiri","DESC")->first();
            if($obj){
                $num = (int) $obj['nosiri']+1;
                if(strlen($num) == 1){
                    $nosiri = "00".$num;
                }
                elseif(strlen($num) == 2){
                    $nosiri = "0".$num;
                }
                else{
                    $nosiri = $num;
                }
            }

            if($sti_nationality == "MALAYSIA"){
                $sti_nationality = "2";
            }

            $bridging = "";

            if(strtoupper($sti_bridging) == "Y"){
                $bridging = "A";
            }

            //CREATE STUDENT_ID
            $std_studentid = $pgm_id.$set_intake.$session_id."1".$nosiri.$bridging;
            if($sti_nationality == "2"){
                $std_studentid = $pgm_id.$set_intake.$session_id."0".$nosiri.$bridging;
            }            
        }

        $destinationPath_image = "";
        $resitdoc_image = '';
        if($file = $request->hasFile('sti_image')) {
            $destinationPath_image = $request->file('sti_image')->getClientOriginalExtension(); 
            $resitdoc_image = base64_encode(file_get_contents($request->file('sti_image')->getRealPath()));
        }

        $data = [
            'std_studentid'     => $std_studentid,
            'nosiri'            => $nosiri,            
            'pgm_fk'            => $pgm_fk ,
            'pgm_id'            => $pgm_id ,
            'cur_intake'        => $cur_intake,
            'sti_session_id'    => $sti_session_id,
            'sti_nationality'   => $sti_nationality,
            'sti_password'      => $password,
            'sti_name'          => strtoupper($sti_name),
            'sti_icno'          => $sti_icno,
            'sti_email'         => $sti_email,
            'cam_id'            => $cam_id,
            'sti_image'         => $resitdoc_image,
            'status_academic'   => '4',
            'sti_image_path'    => $destinationPath_image,
            'recordstatus'      => $recordstatus,
        ];

        $infoSad = sad_users::where('usr_icno',$sti_icno)
        ->where('usr_cat_estudent','1')
        ->where('usr_id',$std_studentid)
        ->where('recordstatus','!=','DEL')->get();

        if(sizeof($infoSad) == 0){
            $dataSad = [
                'usr_id'  =>  $std_studentid,
                'usr_icno'  =>  $sti_icno,
                'usr_passwd'  =>  $password,
                'usr_name'  =>  $sti_name,
                'profile'  =>  $resitdoc_image,
                'recordstatus'  =>  $recordstatus, 
                // 'user_token'  =>  $,
                'usr_status'  =>  'Active',
                'change_password'  =>  'N',
                'usr_startdate'  =>  date('Y-m-d H:i:s'),
                'usr_email'  =>  $sti_email,
                'usr_cat_estudent'  =>  '1',
                'usr_cat_ehep'  =>  '0',
                'usr_cat_ecmis'  =>  '0',
                'usr_cat_ehrms'  =>  '0',
                'usr_cat_admin'  =>  '0',
            ]; 
            
            $infoSad = sad_users::create($dataSad);

            // return $data;
            if($infoSad){
                $obj   = mis_std_info::create($data);            
                return response()->json([
                    'success'=>true,
                    'messages'=>'Proses Berjaya',
                    'data'=>$obj,
                    'data_sad'=>$infoSad,
                ],201);
            }
            else {
                return response()->json([
                    'success'=>false,
                    'messages'=>'Proses Gagal',
                    'data'=>'',
                ],401);
            }            
        }
        else{
            return response()->json([
                'success'=>false,
                'messages'=>'Proses Gagal, Maklumat Pelajar telah wujud!',
                'data'=>'',
            ],401);
        }
    }

    public function update_basic(Request $request){
        $id                   = $request->input('std_studentid');
        $sti_name             = $request->input('sti_name');
        $sti_icno             = $request->input('sti_icno');
        $pgm_id               = $request->input('pgm_id');
        $cur_intake           = $request->input('cur_intake');
        $sti_session_id       = $request->input('sti_session_id');
        $sti_nationality      = $request->input('sti_nationality');

        $data = [
            'sti_name'              => strtoupper($sti_name) ,
            'sti_icno'              => $sti_icno ,
            'pgm_id'                => $pgm_id ,
            'cur_intake'            => $cur_intake,
            'sti_session_id'        => $sti_session_id,
            'sti_nationality'       => $sti_nationality,            
        ];

        //GENERATE PASSWORD
        $salt = "RMY7nZ3+s8xpU1n0O*0o_EGfdoYtd|iU_AzhKCMoSu_xhh-e|~y8FOG*-xLZ";
        $password     = hash("sha256", $sti_icno.$salt);

        $obj = mis_std_info::where('std_studentid',$id)->update($data);

        if($obj){
            $onjSad = sad_users::where('usr_id',$id)->update(['usr_icno' => $sti_icno, 'usr_passwd'  =>  $password, 'usr_name'  =>  strtoupper($sti_name)]);
            if($onjSad){
                return response()->json([
                    'success'=>true,
                    'messages'=>'Successfully Update',
                    'data'=>$obj,
                ],200);
            }
            else{
                return response()->json([
                    'success'=>false,
                    'messages'=>'Failed Update Student Login!',
                    'data'=>$obj,
                ],400);
            }            
        }
        else {
            return response()->json([
                'success'=>false,
                'messages'=>'Update Failed',
                'data'=>'',
            ],400);
        }
    }

    public function resetPassword(Request $request){
        $id = $request->input('std_studentid');
        $rawPswd = trim($request->input('sti_icno'));  
        // $rawPswd = $request->input('passwords');  
        
        //GENERATE PASSWORD
        $salt = "RMY7nZ3+s8xpU1n0O*0o_EGfdoYtd|iU_AzhKCMoSu_xhh-e|~y8FOG*-xLZ";
        $password     = hash("sha256", $rawPswd.$salt);
        // dd($password);

        $obj = sad_users::where('usr_id',$id)->update(['usr_passwd'  =>  $password]);

        if($obj){
            return response()->json([
                'success'=>true,
                'messages'=>'Successfully Change Passwords',
                'data'=>$obj,
            ],200);
        }
        else {
            return response()->json([
                'success'=>false,
                'messages'=>'Failed Change Passwords!',
                'data'=>'',
            ],400);
        }
    }

    public function update(Request $request){
        $std_studentid        = $request->input('std_studentid');
        $sti_name             = $request->input('sti_name');
        $sti_icno             = $request->input('sti_icno');
        $pgm_id               = $request->input('pgm_id');
        $cur_intake            = $request->input('cur_intake');
        $sti_gender           = $request->input('sti_gender');
        $sti_nationality      = $request->input('sti_nationality');
        $sti_status_bumiputra = $request->input('sti_status_bumiputra');
        $sti_race             = $request->input('sti_race');
        $sti_religion         = $request->input('sti_religion');
        $sti_status_oku       = $request->input('sti_status_oku');
        $sti_blood_type       = $request->input('sti_blood_type');
        $sti_email            = $request->input('sti_email');
        $sti_address_1        = $request->input('sti_address_1')." ".$request->input('sti_address_2')." ".$request->input('sti_address_3');;
        $sti_postcode         = $request->input('sti_postcode');
        $sti_state            = $request->input('sti_state');
        $sti_contactno_home   = $request->input('sti_contactno_home');
        $sti_contactno_mobile = $request->input('sti_contactno_mobile');
        $sti_bank_id          = $request->input('sti_bank_id');
        $sti_bank_accountno   = $request->input('sti_bank_accountno');
        $marital_status   = $request->input('marital_status');
        $status_academic   = $request->input('status_academic');
        $duration_std   = $request->input('duration_std');
        $remark   = $request->input('remark');
        $staff_alumi   = $request->input('staff_alumi');
        $sti_sponsorship   = $request->input('sti_sponsorship');
        $sti_baitulmal   = $request->input('sti_baitulmal');
        $sti_asnaf   = $request->input('sti_asnaf');
        // $resitdoc_image       = $request->input('sti_image');

        if($sti_nationality == "MALAYSIA"){
            $sti_nationality = "2";
        }

        if($sti_gender == "Male"){
            $sti_gender = "L";
        }
        else if($sti_gender == "Female"){
            $sti_gender = "P";
        }

        if($sti_race == "Malay"){
            $sti_race = 1;
        }
        else if($sti_race == "Chinese"){
            $sti_race = 99;
        }
        else if($sti_race == "Indian"){
            $sti_race = 111;
        }
        else if($sti_race == "Pre-Bumi"){
            $sti_race = 3;
        }
        else if($sti_race == "Others"){
            $sti_race = "";
        }

        //PROFILE DOC
        // if($file = $request->hasFile('sti_image')) {
        //     // dd('1');
        //     // $destinationPath_image = public_path().'\profile' ;
        //     $image = base64_encode(file_get_contents($request->file('sti_image')->getRealPath()));
        // }else{
        //     // dd('2');
        //     // $destinationPath_image = mis_std_infoController::getCurrFile('mis_std_info','sti_image_path',$std_studentid);
        //     $info_image = mis_std_infoController::getCurrFile('mis_std_info','sti_image',$std_studentid);
        //     $image = $info_image -> sti_image;
        // }


        $data = [
            'std_studentid'         => $std_studentid ,
            'sti_name'              => strtoupper($sti_name) ,
            'sti_icno'              => $sti_icno ,
            'pgm_id'                => $pgm_id ,
            'cur_intake'            => $cur_intake,
            'sti_gender'            => $sti_gender,
            'sti_nationality'       => $sti_nationality,
            'sti_status_bumiputra'  => $sti_status_bumiputra,
            'sti_race'              => $sti_race,
            'sti_religion'          => $sti_religion,
            'sti_status_oku'        => $sti_status_oku,
            'sti_blood_type'        => $sti_blood_type,
            'sti_email'             => $sti_email,
            'sti_address_1'         => $sti_address_1,
            // 'sti_address_2'         => $sti_address_2,
            // 'sti_address_3'         => $sti_address_3,
            'sti_postcode'          => $sti_postcode,
            'sti_state'             => $sti_state,
            'sti_contactno_home'    => $sti_contactno_home,
            'sti_contactno_mobile'  => $sti_contactno_mobile,
            'sti_bank_id'           => $sti_bank_id,
            'sti_bank_accountno'    => $sti_bank_accountno,
            'marital_status'        => strtoupper($marital_status),
            'duration_std'          => $duration_std,
            'remark'                => $remark,
            'staff_alumi'           => $staff_alumi,
            'recordstatus'          => "ADD",
            'sti_sponsorship'       => $sti_sponsorship,
            'sti_baitulmal'         => $sti_baitulmal,
            'sti_asnaf'             => $sti_asnaf,
            // 'sti_image'             => $image,
            // 'sti_image_path' => $destinationPath_image,
        ];

        if($status_academic != ""){
            $data['status_academic'] = $status_academic;
        }

        $obj = mis_std_info::where('std_studentid',$std_studentid)-> update($data);

        if($obj){

            return response()->json([
                'success'=>true,
                'messages'=>'Successfully Register',
                'data'=>$obj,
            ],201);
        }
        else {
            return response()->json([
                'success'=>false,
                'messages'=>'Registration Failed',
                'data'=>'',
            ],400);
        }
    }

    public function showByPassword(Request $request){
        $std_studentid = $request->input('std_studentid');
        $usr_passwd = $request->input('usr_passwd');
        $salt = "RMY7nZ3+s8xpU1n0O*0o_EGfdoYtd|iU_AzhKCMoSu_xhh-e|~y8FOG*-xLZ";
        $password     = hash("sha256", $usr_passwd.$salt);

        $obj = sad_users::where('usr_id',$std_studentid)
        ->where('usr_passwd',$password)->get([
            'usr_icno',
            'usr_name',
            'usr_id'
        ]);

        if(sizeof($obj) > 0){

            return response()->json([
                'success'=>true,
                'messages'=>'Proses Berjaya',
                'data'=>$obj,
            ],200);
        }
        else {
            return response()->json([
                'success'=>false,
                'messages'=>'Proses Gagal',
                'data'=>'',
            ],400);
        }
    }

    public function show($id){

        $obj = mis_std_info::where([['recordstatus','!=','DEL'],['std_studentid','=',$id]])->first();
        if($obj){

            return response()->json([
                'success'=>true,
                'messages'=>'Proses Berjaya',
                'data'=>$obj,
            ],200);
        }
        else {
            return response()->json([
                'success'=>false,
                'messages'=>'Proses Gagal',
                'data'=>'',
            ],200);
        }
    }


    public function showDet($id){

        $obj = mis_std_info::where([
            ['mis_std_info.recordstatus', '!=', 'DEL'],
            ['mis_std_info.std_studentid', '=', $id]
        ])
            ->leftjoin('mis_prm_programme', 'mis_prm_programme.pk_id', '=', 'mis_std_info.pgm_fk')
            ->leftjoin('mis_nationality', 'mis_nationality.pk_id', '=', 'mis_std_info.sti_nationality')
            ->leftjoin('mis_race', 'mis_race.sti_race_id', '=', 'mis_std_info.sti_race')
            ->leftjoin('mis_native', 'mis_native.pk_id', '=', 'mis_std_info.sti_status_bumiputra')
            ->leftjoin('mis_religion', 'mis_religion.sti_religion_id', '=', 'mis_std_info.sti_religion')
            ->leftjoin('mis_status_oku', 'mis_status_oku.sti_status_oku_id', '=', 'mis_std_info.sti_status_oku')
            ->leftjoin('mis_blood_type', 'mis_blood_type.sti_blood_type_id', '=', 'mis_std_info.sti_blood_type')
            ->leftjoin('mis_gender', 'mis_gender.sti_gender_id', '=', 'mis_std_info.sti_gender')
            ->leftjoin('aca_cal_category', 'aca_cal_category.pk_id', '=', 'mis_prm_programme.pgm_area')
            ->first([
                'pgm_name',
                'pgm_fk',
                'pgm_status',
                'mis_std_info.pgm_id',
                'cam_id',
                'fac_id',
                'sti_name',
                'sti_session_id',
                'sti_nationality_name',
                'mis_std_info.sti_nationality',
                'sti_race_name',
                'sti_native_name',
                'sti_religion_name',
                'sti_status_oku_name',
                'sti_blood_type_name',
                'sti_email',
                'sti_bank_id',
                'sti_bank_accountno',
                'sti_gender_name',
                'sti_address_1',
                'sti_address_2',
                'sti_address_3',
                'sti_postcode',
                'sti_state',
                'sti_contactno_home',
                'sti_contactno_mobile',
                'sti_icno',
                'cur_intake',
                'status_academic',
                'category',
                'pgm_area'
            ]);
            
            if($obj){

            return response()->json([
                'success'=>true,
                'messages'=>'Proses Berjaya',
                'data'=>$obj,
            ],200);
        }
        else {
            return response()->json([
                'success'=>false,
                'messages'=>'Proses Gagal',
                'data'=>'',
            ],200);
        }
    }



    public function showGender($sti_icno){
// dd('d');
        $obj = mis_std_info::where([
            ['mis_std_info.recordstatus', '!=', 'DEL'],
            ['mis_std_info.sti_icno', '=', $sti_icno]
        ])
            ->leftjoin('mis_prm_programme', 'mis_prm_programme.pk_id', '=', 'mis_std_info.pgm_fk')
            ->leftjoin('mis_nationality', 'mis_nationality.pk_id', '=', 'mis_std_info.sti_nationality')
            ->leftjoin('mis_race', 'mis_race.sti_race_id', '=', 'mis_std_info.sti_race')
            ->leftjoin('mis_native', 'mis_native.pk_id', '=', 'mis_std_info.sti_status_bumiputra')
            ->leftjoin('mis_religion', 'mis_religion.sti_religion_id', '=', 'mis_std_info.sti_religion')
            ->leftjoin('mis_status_oku', 'mis_status_oku.sti_status_oku_id', '=', 'mis_std_info.sti_status_oku')
            ->leftjoin('mis_blood_type', 'mis_blood_type.sti_blood_type_id', '=', 'mis_std_info.sti_blood_type')
            ->leftjoin('mis_gender', 'mis_gender.sti_gender_id', '=', 'mis_std_info.sti_gender')
            ->leftjoin('aca_cal_category', 'aca_cal_category.pk_id', '=', 'mis_prm_programme.pgm_area')
            ->first([
                // 'pgm_name',
                // 'pgm_fk',
                // 'pgm_status',
                // 'mis_std_info.pgm_id',
                // 'cam_id',
                // 'fac_id',
                // 'sti_name',
                // 'sti_session_id',
                // 'sti_nationality_name',
                // 'mis_std_info.sti_nationality',
                // 'sti_race_name',
                // 'sti_native_name',
                // 'sti_religion_name',
                // 'sti_status_oku_name',
                // 'sti_blood_type_name',
                // 'sti_email',
                // 'sti_bank_id',
                // 'sti_bank_accountno',
                'sti_gender_name',
                // 'sti_address_1',
                // 'sti_address_2',
                // 'sti_address_3',
                // 'sti_postcode',
                // 'sti_state',
                // 'sti_contactno_home',
                // 'sti_contactno_mobile',
                // 'sti_icno',
                // 'cur_intake',
                // 'status_academic',
                // 'category',
                // 'pgm_area'
            ]);
            
            if($obj){

            return response()->json([
                'success'=>true,
                'messages'=>'Proses Berjaya',
                'data'=>$obj,
            ],200);
        }
        else {
            return response()->json([
                'success'=>false,
                'messages'=>'Proses Gagal',
                'data'=>'',
            ],200);
        }
    }

    
    public function showByIC($id){

        $obj = mis_std_info::where([['recordstatus','!=','DEL'],['sti_icno','=',$id]])->get();
        if($obj){

            return response()->json([
                'success'=>true,
                'messages'=>'Proses Berjaya',
                'data'=>$obj,
            ],200);
        }
        else {
            return response()->json([
                'success'=>false,
                'messages'=>'Proses Gagal',
                'data'=>'',
            ],200);
        }
    }

    public function changeProgram(Request $request){

        $id = $request->input('std_studentid');
        $cam_id = $request->input('cam_id');
        $sti_session_id = $request->input('session_id');
        $cur_intake = $request->input('cur_intake');
        $pgm_id = $request->input('pgm_id');
        $pgm_fk = $request->input('pgm_fk');
        $sti_nationality = $request->input('sti_nationality');

        $objStd = mis_std_info::where([['recordstatus','!=','DEL'],['std_studentid','=',$id]])->first();

        $objGenerateID = $this->generateID($cam_id,$sti_session_id,$cur_intake,$pgm_id,$sti_nationality);

        $std_studentid = $objGenerateID['std_studentid'];
        $nosiri = $objGenerateID['nosiri'];

        $data = [
            'status_academic'   => '7',
            'old_matrix'        => $objStd['std_studentid'],
            'reg_matrix'        => $std_studentid,
            'std_studentid'     => $objStd['std_studentid'].'-CP',
            'recordstatus'      => 'DEL'
        ];


        $objUpdate = mis_std_info::where([['recordstatus','!=','DEL'],['std_studentid','=',$id]])->update($data);

        if($objUpdate){
            
            $NewobjStd = $objStd->replicate();
            $NewobjStd->save();
            
            $data = [
                'std_studentid' => $std_studentid,
                'nosiri' => $nosiri,
                'cam_id' => $cam_id,
                'sti_session_id' => $sti_session_id,
                'cur_intake' => $cur_intake,
                'pgm_id' => $pgm_id,
                'pgm_fk' => $pgm_fk,
                'status_academic' => '4'
            ];
    
            $obj = mis_std_info::where([['recordstatus','!=','DEL'],['std_studentid','=',$id]])->update($data);
            if($obj){
                $objSad = sad_users::where('usr_id',$id)->update(['usr_id' => $std_studentid]);

                if($objSad){           
                    return response()->json([
                        'success'=>true,
                        'messages'=>'Proses Berjaya',
                        'data'=>$obj,
                    ],201);
                }                 
            }
        }
        else {
            return response()->json([
                'success'=>false,
                'messages'=>'Awal-awal dah Proses Gagal',
                'data'=>'',
            ],401);
        }      
    }

    public function setStatus_academic(Request $request){
        $std_studentid = $request->input('std_studentid');
        $status_academic = $request->input('status_academic');

        $obj = mis_std_info::where('std_studentid',$std_studentid)->update(['status_academic' => $status_academic]);

        if($obj){

            return response()->json([
                'success'=>true,
                'messages'=>'Proses Berjaya',
                'data'=>$obj,
            ],200);
        }
        else {
            return response()->json([
                'success'=>false,
                'messages'=>'Proses Gagal',
                'data'=>'',
            ],400);
        }
    }

    public function list(){
        $obj = mis_std_info::where([
            ['recordstatus','!=','DEL']
            ])
        ->orderBy('mis_std_info.lastupdateon','DESC')
            ->first();

        if($obj){

            return response()->json([
                'success'=>true,
                'messages'=>'Proses Berjaya',
                'data'=>$obj,
            ],200);
        }
        else {
            return response()->json([
                'success'=>false,
                'messages'=>'Proses Gagal',
                'data'=>'',
            ],200);
        }
    }

    public function listByCam(Request $request){

        $pgm_fk = $request->input("pgm_id");
        $cur_intake = $request->input("cur_intake");
        $input_txt = $request->input("input_txt");
        $cam_id = $request->input("cam_id");
        
        $obj = mis_std_info::
        leftJoin('mis_prm_programme', 'mis_prm_programme.pk_id', '=', 'mis_std_info.pgm_fk')
        ->leftJoin('mis_status', 'mis_status.sts_status_id', '=', 'mis_std_info.status_academic')
        ->when($input_txt != "",function($query) use($input_txt){
            return $query->where('sti_name','LIKE',"%".$input_txt."%")
            ->orWhere('sti_icno',$input_txt)
            ->orWhere('std_studentid',$input_txt);
        })
        ->when($input_txt == "",function($query) use($pgm_fk,$cur_intake){
            return $query->where('mis_std_info.pgm_fk',$pgm_fk)
            ->when($cur_intake != "",function($q) use ($cur_intake){
                return $q->where('mis_std_info.cur_intake',$cur_intake);
            });
        })        
        ->where('mis_std_info.cam_id',$cam_id)
        ->where('mis_std_info.recordstatus','!=','DEL')
        ->orderBy('mis_std_info.lastupdateon','DESC')
        ->get();

// Iterate over each student and fetch their latest academic record
foreach ($obj as $student) {
    $pelajar = (string) $student->std_studentid;

    $latest_academic   =mis_std_curAcademic::
    //  DB::table('mis_std_curAcademic')
        where('std_studentid',$pelajar)
        // where('std_studentid','DNS09230092')
        ->whereNotNull('std_gpa')

        ->where('recordstatus', '!=', 'DEL')
        ->orderBy('pk_cur_academic', 'DESC')
        ->first(['pk_cur_academic',
    'fk_acaCal',
'std_semester',
'std_gpa',
]);
// dd($latest_academic);

   $student->latest_academic = ($latest_academic && $latest_academic->fk_acaCal) ? $latest_academic->fk_acaCal : null;
   $student->latestSem = ($latest_academic && $latest_academic->std_semester) ? $latest_academic->std_semester : null;
   $student->latestGPA = ($latest_academic && $latest_academic->std_gpa) ? $latest_academic->std_gpa : null;

    // $student->latest_academic = $latest_academic;
}

// $student->latest_academic = $latest_academic ->fk_acaCal;
// $student->latestSem = $latest_academic->fk_acaCal;
// $student->latestGPA = $latest_academic->std_gpa;
        if($obj){

            return response()->json([
                'success'=>true,
                'messages'=>'Proses Berjaya',
                'data'=>$obj,
            ],200);
        }
        else {
            return response()->json([
                'success'=>false,
                'messages'=>'Proses Gagal',
                'data'=>'',
            ],400);
        }
    }

    public function listNew(Request $request){
        $cam_id = $request->input("cam_id");
        
        $obj = mis_std_info::
        leftJoin('mis_prm_programme', 'mis_prm_programme.pk_id', '=', 'mis_std_info.pgm_fk')
        ->leftJoin('mis_status', 'mis_status.sts_status_id', '=', 'mis_std_info.status_academic')
        // ->leftJoin('mis_prm_faccampus', 'mis_prm_faccampus.fac_id', '=', 'mis_prm_programme.fac_id')
        // ->leftJoin('mis_prm_college', 'mis_prm_college.pk_id', '=', 'mis_prm_faccampus.cam_id')
        ->where('mis_std_info.cam_id',$cam_id)
        ->where('mis_std_info.status_academic','4')
        ->where('mis_std_info.recordstatus','!=','DEL')
        ->orderBy('mis_std_info.lastupdateon','DESC')
        ->get();

// Iterate over each student and fetch their latest academic record
foreach ($obj as $student) {
    $pelajar = (string) $student->std_studentid;

    $latest_academic   =mis_std_curAcademic::
    //  DB::table('mis_std_curAcademic')
        where('std_studentid',$pelajar)
        // 
        ->where('recordstatus', '!=', 'DEL')
        ->orderBy('pk_cur_academic', 'DESC')
        ->first(['pk_cur_academic',
    'fk_acaCal',
'std_semester',
'std_gpa',
]);
// dd($latest_academic);
    // Append the latest academic record to the student object
    $student->latest_academic = $latest_academic;
}
        if($obj){

            return response()->json([
                'success'=>true,
                'messages'=>'Proses Berjaya',
                'data'=>$obj,
            ],200);
        }
        else {
            return response()->json([
                'success'=>false,
                'messages'=>'Proses Gagal',
                'data'=>'',
            ],400);
        }
    }

    public function delete(){
        
    }

    public function getCurrFile($tablename,$param1,$param2){

        $output = '';

        // if($tablename == 'mis_std_info'){
        //     $output = mis_std_info::select($param1)
        //     ->where([
        //         ['mis_std_info.recordstatus','!=','DEL'],
        //         ['mis_std_info.std_studentid','=',$param2]
        //         ])->first();

        // }
        
            return $output;
    }

    public function generateID($cam_id,$sti_session_id,$cur_intake,$pgm_id,$sti_nationality){
        
        //GET CUR_INTAKE & SESSION
        $session_id = substr($cur_intake,6);
        $set_intake = date_format(date_create(substr($cur_intake,0,3)),'m');

        //SET NOSIRI
        $nosiri = "001";
        $obj = mis_std_info::select("nosiri")
        ->where('pgm_id',$pgm_id)
        ->where('cur_intake',$cur_intake)
        ->where('sti_session_id',$sti_session_id)
        ->where('cam_id',$cam_id)
        ->orderBy("nosiri","DESC")->first();

        if($obj){
            $num = (int) $obj['nosiri']+1;
            if(strlen($num) == 1){
                $nosiri = "00".$num;
            }
            elseif(strlen($num) == 2){
                $nosiri = "0".$num;
            }
            else{
                $nosiri = $num;
            }
        }

        if($sti_nationality == "MALAYSIA"){
            $sti_nationality = "2";
        }

        //CREATE STUDENT_ID
        $std_studentid = $pgm_id.$set_intake.$session_id."3".$nosiri;
        if($sti_nationality == "2"){
            $std_studentid = $pgm_id.$set_intake.$session_id."2".$nosiri;
        }

        $data = ['std_studentid' => $std_studentid, 'nosiri' => $nosiri];
        
        return $data;
    }

    public function listStdActiveByPgmIntake(Request $request){

        $cam_id = $request->input('cam_id');
        $cal_cohort = $request->input('cal_cohort');
        $cur_year = $request->input('cur_year');
        $pgm_fk = $request->input('pgm_fk');

        $obj = mis_std_info::
        leftjoin('mis_std_curAcademic','mis_std_curAcademic.std_studentid','mis_std_info.std_studentid')->
        leftjoin('mis_prm_calendar','mis_prm_calendar.cal_id','mis_std_curAcademic.fk_acaCal')->
        leftjoin('mis_prm_programme','mis_prm_programme.pgm_id','mis_std_info.pgm_id')->
        where('mis_std_info.status_academic',1)->
        where('mis_std_info.pgm_fk',$pgm_fk)->
        where('mis_prm_calendar.cur_year',$cur_year)->
        where('mis_prm_calendar.cal_cohort',$cal_cohort)->
        where('mis_std_info.cam_id',$cam_id)->
        // groupBy(
        //     ['mis_std_curAcademic.pk_cur_academic',
        //     'mis_std_info.std_studentid',
        //     'mis_std_info.sti_icno',
        //     'mis_prm_calendar.cal_id',
        //     'mis_std_info.sti_name',
        //     'mis_prm_programme.pgm_id',
        //     'mis_prm_programme.pgm_name',
        //     'mis_prm_calendar.cur_year',
        //     'mis_prm_calendar.cal_cohort',
        //     'mis_std_curAcademic.std_gpa',
        //     'mis_std_curAcademic.std_cgpa']
        //     )->
        orderBy('mis_std_info.std_studentid','ASC')->
        get(
            [
                'mis_std_info.std_studentid',
                'mis_std_info.sti_icno',
                'mis_prm_calendar.cal_id',
                // 'mis_prm_programme.dtp_id',
                'mis_std_info.sti_name',
                'mis_prm_programme.pgm_id',
                'mis_prm_programme.pgm_name',
                'mis_prm_calendar.cur_year',
                'mis_prm_calendar.cal_cohort',
                'mis_std_curAcademic.std_gpa',
                'mis_std_curAcademic.std_cgpa',
                'mis_std_curAcademic.pk_cur_academic',
                // 'mis_prm_calendar.cal_id',
                // 'mis_prm_programme.dtp_id'
            ]
        );

        if($obj){
            return response()->json([
                'success'=>true,
                'messages'=>'Proses Berjaya',
                'data'=>$obj,
            ],200);
        }
        else {
            return response()->json([
                'success'=>false,
                'messages'=>'Proses Gagal',
                'data'=>'',
            ],400);
        }
    }



    
    public function auditBergraduatChecked(Request $request){
        $std_studentid = $request->input('std_studentid');
        $perms_facGrad = $request->input('perms_facGrad');
        $perms_facGrad_verifier = $request->input('perms_facGrad_verifier');
        $perms_facGrad_verifyDate = $request->input('perms_facGrad_verifyDate');
        

        $date = ($perms_facGrad_verifyDate == '')?null :$perms_facGrad_verifyDate ; 


        $obj = mis_std_info::
        where('std_studentid', $std_studentid)
        ->update(['perms_facGrad' => $perms_facGrad,
        'perms_facGrad_verifier' => $perms_facGrad_verifier,
        'perms_facGrad_verifyDate' => $date,
]);
        // ->   where('std_studentid', $std_studentid)
        // ->get([
        //     'mis_std_curAcademic.std_studentid',
        //     'mis_std_info.sti_name',
        //     'mis_std_info.sti_icno',
        //     'mis_std_info.perms_facGrad',
          
        // ])

   
        $updated  = mis_std_info::
        where([['std_studentid', $std_studentid],['recordstatus', '!=','DEL']])->first(
            [
                    'mis_std_info.std_studentid',
                    'mis_std_info.sti_name',
                    'mis_std_info.sti_icno',
                    'mis_std_info.perms_facGrad',
                  
                ]
        );
        if($obj){          

            return response()->json([
                'success'=>true,
                'messages'=>'List Found',
                'data'=> $updated,

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
}
