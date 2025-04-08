<?php

namespace App\Http\Controllers;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use App\Models\sad_users;
use App\Models\mis_std_info;
use App\Models\mis_status;
use App\Models\mis_std_parent;
use App\Models\mis_race;
use App\Models\mis_nationality;
use App\Models\mis_gender;
use DB;

class mis_std_infoController_finance extends Controller
{
    public function  __construct()
    {
        $this->middleware('public');
    }
    
    public function list(){
        $obj = DB::table('mis_std_info')
        ->leftJoin('mis_status', 'mis_status.sts_status_id', '=', 'mis_std_info.status_academic')
        ->leftJoin('mis_std_parent', 'mis_std_parent.std_studentid', '=', 'mis_std_info.std_studentid')
        ->leftJoin('mis_race', 'mis_race.sti_race_id', '=', 'mis_std_info.sti_race')
        ->leftJoin('mis_nationality', 'mis_nationality.pk_id', '=', 'mis_std_info.sti_nationality')
        ->leftJoin('mis_gender', 'mis_gender.sti_gender_id', '=', 'mis_std_info.sti_gender')
        ->leftJoin(DB::raw('(SELECT * FROM mis_std_curAcademic
            WHERE pk_cur_academic IN (SELECT MAX(pk_cur_academic) FROM mis_std_curAcademic GROUP BY std_studentid)
            ORDER BY std_studentid, std_semester ASC) t1'), 't1.std_studentid', '=', 'mis_std_info.std_studentid')
        ->leftJoin('mis_prm_calendar', 'mis_prm_calendar.cal_id', '=', 't1.fk_acaCal')
        ->where('mis_std_info.recordstatus', '!=', 'DEL')
        ->orderBy('mis_std_info.std_studentid','ASC')
        ->get([
            'sti_name',
            'mis_std_info.std_studentid',
            'mis_std_info.pgm_id',
            'mis_std_info.cur_intake',
            'mis_prm_calendar.cur_year',
            't1.std_semester',
            'sti_icno',
            'sti_gender_name',
            'sti_race_name',
            'sti_nationality_name',
            DB::raw("DATE_FORMAT(STR_TO_DATE(CONCAT('19', SUBSTRING(sti_icno, 1, 6)), '%Y%m%d'), '%d-%m-%Y') AS date_of_birth"),
            'sti_address_1',
            'sti_address_2',
            'sti_address_3',
            'sti_postcode',
            'sti_state',
            'sti_email',
            'sti_contactno_mobile',
            'sts_status_name_en',
            'par_father_name',
            'par_father_icno',
            'par_father_address',
            'par_father_contactno',
            'par_mother_name',
            'par_mother_icno',
            'par_mother_contactno',
            'par_mother_address',
            'par_family_income'
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

    public function showByIC($ic){
        $obj = DB::table('mis_std_info')
        ->leftJoin('mis_status', 'mis_status.sts_status_id', '=', 'mis_std_info.status_academic')
        ->leftJoin('mis_std_parent', 'mis_std_parent.std_studentid', '=', 'mis_std_info.std_studentid')
        ->leftJoin('mis_race', 'mis_race.sti_race_id', '=', 'mis_std_info.sti_race')
        ->leftJoin('mis_nationality', 'mis_nationality.pk_id', '=', 'mis_std_info.sti_nationality')
        ->leftJoin('mis_gender', 'mis_gender.sti_gender_id', '=', 'mis_std_info.sti_gender')
        ->leftJoin(DB::raw('(SELECT * FROM mis_std_curAcademic
            WHERE pk_cur_academic IN (SELECT MAX(pk_cur_academic) FROM mis_std_curAcademic GROUP BY std_studentid)
            ORDER BY std_studentid, std_semester ASC) t1'), 't1.std_studentid', '=', 'mis_std_info.std_studentid')
        ->leftJoin('mis_prm_calendar', 'mis_prm_calendar.cal_id', '=', 't1.fk_acaCal')
        ->where('mis_std_info.recordstatus', '!=', 'DEL')
        ->where('mis_std_info.sti_icno',$ic)
        ->orderBy('mis_std_info.std_studentid','ASC')
        ->get([
            'sti_name',
            'mis_std_info.std_studentid',
            'mis_std_info.pgm_id',
            'mis_std_info.cur_intake',
            'mis_prm_calendar.cur_year',
            't1.std_semester',
            'sti_icno',
            'sti_gender_name',
            'sti_race_name',
            'sti_nationality_name',
            DB::raw("DATE_FORMAT(STR_TO_DATE(CONCAT('19', SUBSTRING(sti_icno, 1, 6)), '%Y%m%d'), '%d-%m-%Y') AS date_of_birth"),
            'sti_address_1',
            'sti_address_2',
            'sti_address_3',
            'sti_postcode',
            'sti_state',
            'sti_email',
            'sti_contactno_mobile',
            'sts_status_name_en',
            'par_father_name',
            'par_father_icno',
            'par_father_address',
            'par_father_contactno',
            'par_mother_name',
            'par_mother_icno',
            'par_mother_contactno',
            'par_mother_address',
            'par_family_income'
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

}
