<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use App\Models\hep_aduanResponden;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;

class hep_aduanRespondenController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }

    public function register(Request $request)
    {
        $pk_id = $request->input('pk_id');
        $FK_jenisaduanHostel = $request->input('FK_jenisaduanHostel');
        $FK_idStudent = $request->input('FK_idStudent');
        $aduan_rujukan = $request->input('aduan_rujukan');
        $aduan_status = $request->input('aduan_status');
        $aduan_warden_assigned = $request->input('aduan_warden_assigned');
        $aduan_details = $request->input('aduan_details');
        $aduan_date = $request->input('aduan_date');
        $aduan_warden_remark = $request->input('aduan_warden_remark');
        $aduan_alert = $request->input('aduan_alert');

        $FK_clg = $request->input('FK_clg');
        $FK_block = $request->input('FK_block');
        $FK_hostel = $request->input('FK_hostel');
        $FK_room = $request->input('FK_room');

        // $aduan_upload = $request->input('aduan_upload');
        if ($request->hasFile('aduan_upload')) {
            $file = $request->file('aduan_upload');
            $aduan_upload = time() . $file->getClientOriginalName();
            $file->move('aduanHostel', $aduan_upload);
        }


        $lastapproveby = $request->input('lastapproveby');
        $resetIDwhendelete = DB::statement("ALTER TABLE hep_aduanResponden   AUTO_INCREMENT =1");

        $obj = hep_aduanResponden::create([
            'pk_id' => $pk_id,
            'FK_jenisaduanHostel' => $FK_jenisaduanHostel,
            'FK_idStudent' => $FK_idStudent,
            'aduan_rujukan' => $aduan_rujukan,
            'aduan_status' => $aduan_status,
            'aduan_warden_assigned' => $aduan_warden_assigned,
            'aduan_details' => $aduan_details,
            // 'aduan_date' => date("Y-m-d"),
            'aduan_date' => $aduan_date,
            'aduan_warden_remark' => $aduan_warden_remark,
            'aduan_upload' => $aduan_upload,
            'aduan_alert' => $aduan_alert,

            'FK_clg' => $FK_clg,
            'FK_block' => $FK_block,
            'FK_hostel' => $FK_hostel,
            'FK_room' => $FK_room,

            'lastapproveby' => $lastapproveby,
            'recordstatus' => 'ADD',

        ]);

        if ($obj) {

if ($aduan_status === 'New') {
    $EmailPurpose = hep_aduanResponden::where('hep_aduanResponden.pk_id', $obj ->pk_id)
    ->leftJoin('mis_prm_college', 'mis_prm_college.pk_id', '=', 'hep_aduanResponden.FK_clg')
    ->leftJoin('hep_hostel', 'hep_hostel.hostel_id', '=', 'hep_aduanResponden.FK_hostel')
    ->leftJoin('hep_hostel_blok', 'hep_hostel_blok.block_id', '=', 'hep_aduanResponden.FK_block')
    // ->leftJoin('hep_hostel_room', 'hep_hostel_room.room_id', '=', 'hep_aduanResponden.FK_room')
    ->leftJoin('mis_std_info', 'mis_std_info.std_studentid', '=', 'hep_aduanResponden.FK_idStudent')
    ->select(
        'mis_std_info.sti_name',
        'hep_aduanResponden.FK_idStudent',
        'mis_prm_college.clg_name',
        'hep_hostel.hostel_name',
        'hep_hostel_blok.block_name',
        // 'hep_hostel_room.room_no',
        'hep_aduanResponden.*'
    )
    ->first(); // Or get() if you expect multiple results

    $roomStd = $obj-> FK_room;
$data = array(
    'name' => $EmailPurpose->sti_name,
    'idStdStaff' => $EmailPurpose->stud_id,
    'title' => 'Hostel Check-Out Application',
    'Hostel' => $EmailPurpose->hostel_name,
    'Block' => $EmailPurpose->block_name,
    'Room' => $roomStd,
    'content' => "
        Campus :$EmailPurpose->clg_name
        <br>
        Student ID :$EmailPurpose->FK_idStudent
        <br>
        Student Name : $EmailPurpose->sti_name
        <br>
        Applied Hostel : $EmailPurpose->hostel_name
        <br>
        Applied Block : $EmailPurpose->block_name
        <br>
        Applied Room : $roomStd
        <br>
        Status : <strong> $aduan_status</strong>

    ",
);

Mail::send('mail', $data, function ($message) use ($data, $EmailPurpose) {
    // $message->to($array->std_id.'@gmail.com',  $array->std_name)->subject('Hostel Booking Application');
    $message->to('hostel@ucmi.edu.my', 'UNIT PENGURUSAN HOSTEL')->subject('Hostel Check-Out Application');
    // $message->to('ehepa@ucmi.edu.my', 'hepa')->subject('Hostel Check-Out Application');
    // $message->to('mohdafiez7@gmail.com', 'Test Name')->subject('Hostel Booking Application');
    $message->from($EmailPurpose->FK_idStudent . '@student.ucmi.edu.my',  $EmailPurpose->sti_name);
});}
          
            return response()->json([
                'success' => 'true',
                'message' => 'Register Success!',
                'data' => $obj
            ], 201);
        } else {
            return response()->json([
                'success' => 'false',
                'message' => 'Bad Request',
                'data' => $obj
            ], 400);
        }
    }


    public function show(Request $request)
    {
        $pk_id = $request->input('pk_id');

        $obj = hep_aduanResponden::where('pk_id', $pk_id)->first();

        if ($obj) {
            return response()->json([
                'success' => 'true',
                'message' => 'Show Success!',
                'data' => $obj
            ], 200);
        }
    }
    // type complaint
    // location
    // mis std

    public function list()
    {
        $obj = hep_aduanResponden::SELECT(
            'hep_aduanResponden.pk_id',
            'FK_jenisaduanHostel',
            'FK_idStudent',
            'aduan_rujukan',
            'aduan_status',
            'aduan_warden_assigned',
            'aduan_details',
            'aduan_date',
            'aduan_warden_remark',
            'aduan_upload',
            'aduan_alert',
            'hep_aduanResponden.lastapproveby',
            'hep_aduanResponden.lastupdateby',
            'hep_aduanResponden.created_at',
            'hep_aduanResponden.updated_at',
            'hep_aduanResponden.recordstatus',
            'aduan_code',
            'aduan_nama',
            'aduan_remarks',
            'clg_name',
            'block_name',
            'hostel_name',
            'FK_room',
            'FK_clg',
            'FK_block',
            'FK_hostel',

            'sti_name',

            'aduan_nama',

            'sad_users.usr_name as PIC_aduan',
        )
            ->leftjoin('mis_std_info', 'mis_std_info.std_studentid', 'hep_aduanResponden.FK_idStudent')
            ->leftjoin('hep_jenisaduanHostel', 'hep_jenisaduanHostel.pk_id', 'hep_aduanResponden.FK_jenisaduanHostel')
            ->leftjoin('mis_prm_college', 'mis_prm_college.pk_id', 'hep_aduanResponden.FK_clg')
            ->leftjoin('hep_hostel', 'hep_hostel.hostel_id', 'hep_aduanResponden.FK_hostel')
            ->leftjoin('hep_hostel_blok', 'hep_hostel_blok.block_id', 'hep_aduanResponden.FK_block')
            ->leftjoin('sad_users', 'sad_users.usr_id', 'hep_aduanResponden.aduan_warden_assigned')
            ->where([['hep_aduanResponden.recordstatus', '!=', 'DEL']])
            ->orderBy('aduan_date', 'desc') // Add this line to sort by aduan_date in ascending order
            ->get();


        if ($obj) {
            return response()->json([
                'success' => 'true',
                'message' => 'List Success!',
                'data' => $obj
            ], 200);
        }
    }


    public function update(Request $request)
    {
        $pk_id = $request->input('pk_id');
        $FK_jenisaduanHostel = $request->input('FK_jenisaduanHostel');
        $FK_idStudent = $request->input('FK_idStudent');
        $aduan_rujukan = $request->input('aduan_rujukan');
        $aduan_status = $request->input('aduan_status');
        $aduan_warden_assigned = $request->input('aduan_warden_assigned');
        $aduan_details = $request->input('aduan_details');
        // $aduan_date = $request->input('aduan_date');
        $aduan_warden_remark = $request->input('aduan_warden_remark');
        $aduan_upload = $request->input('aduan_upload');
        $aduan_alert = $request->input('aduan_alert');
        $lastupdateby = $request->input('lastupdateby');

        $obj = hep_aduanResponden::where([['pk_id', '=', $pk_id]])->update([

            // 'FK_jenisaduanHostel' => $FK_jenisaduanHostel,
            // 'FK_idStudent' => $FK_idStudent,
            // 'aduan_rujukan' => $aduan_rujukan,
            'aduan_status' => $aduan_status,
            'aduan_warden_assigned' => $aduan_warden_assigned,
            // 'aduan_details' => $aduan_details,
            // 'aduan_date' => date("Y-m-d"),
            'aduan_warden_remark' => $aduan_warden_remark,
            // 'aduan_upload' => $aduan_upload,
            // 'aduan_alert' => $aduan_alert,
            // 'lastupdateby' => $lastupdateby,
            'recordstatus' => 'EDT',

        ]);


        if ($obj) {
            if ($aduan_status !== 'New') {
                $EmailPurpose = hep_aduanResponden::where('hep_aduanResponden.pk_id', $pk_id)
                ->leftJoin('mis_prm_college', 'mis_prm_college.pk_id', '=', 'hep_aduanResponden.FK_clg')
                ->leftJoin('hep_hostel', 'hep_hostel.hostel_id', '=', 'hep_aduanResponden.FK_hostel')
                ->leftJoin('hep_hostel_blok', 'hep_hostel_blok.block_id', '=', 'hep_aduanResponden.FK_block')
                ->leftJoin('hep_hostel_room', 'hep_hostel_room.room_id', '=', 'hep_aduanResponden.FK_room')
                ->leftJoin('mis_std_info', 'mis_std_info.std_studentid', '=', 'hep_aduanResponden.FK_idStudent')
                ->select(
                    'mis_std_info.sti_name',
                    'hep_aduanResponden.FK_idStudent',
                    'mis_prm_college.clg_name',
                    'hep_hostel.hostel_name',
                    'hep_hostel_blok.block_name',
                    'hep_hostel_room.room_no',
                    'hep_aduanResponden.*'
                )
                ->first(); // Or get() if you expect multiple results

                $data = array(
                    'name' => $EmailPurpose->sti_name,
                    'idStdStaff' => $EmailPurpose->FK_idStudent,
                    'title' => 'Hostel Check-In/Check-Out Application',
                    'Hostel' => $EmailPurpose->hostel_name,
                    'Block' => $EmailPurpose->block_name,
                    'Room' => $EmailPurpose->room_no,
                    'content' => "
                        Campus :$EmailPurpose->clg_name
                        <br>
                        Student ID :$EmailPurpose->std_id
                        <br>
                        Student Name : $EmailPurpose->std_name
                        <br>
                        Applied Hostel : $EmailPurpose->hostel_name
                        <br>
                        Applied Block : $EmailPurpose->block_name
                        <br>
                        Applied Room : $EmailPurpose->room_no
                    ",
                );

                Mail::send('mail', $data, function ($message) use ($data, $EmailPurpose) {
                    // $message->to($array->std_id.'@gmail.com',  $array->std_name)->subject('Hostel Booking Application');
                    $message->to($EmailPurpose->FK_idStudent . '@student.ucmi.edu.my',  $EmailPurpose->sti_name)->subject('Hostel Change Application');
                    // $message->to('mohdafiez7@gmail.com', 'Test Name')->subject('Hostel Booking Application');
                    $message->from('hostel@ucmi.edu.my', 'UNIT PENGURUSAN HOSTEL');
                    // $message->from('ehepa@ucmi.edu.my', 'hepa');
                });
            }


         
            return response()->json([
                'success' => true,
                'message' => "Update Success!",
                'data' => hep_aduanResponden::where('pk_id', $pk_id)->get()
            ], 200);
        } else {
            return response()->json([
                'success' => false,
                'message' => "Update Failed!",
                'data' => ''
            ], 404);
        }
    }

    public function updateByStudent(Request $request)
    {
        $pk_id = $request->input('pk_id');

        $FK_jenisaduanHostel = $request->input('FK_jenisaduanHostel');
        // $FK_idStudent = $request->input('FK_idStudent');
        $aduan_rujukan = $request->input('aduan_rujukan');
        // $aduan_status = $request->input('aduan_status');
        $aduan_warden_assigned = $request->input('aduan_warden_assigned');
        $aduan_details = $request->input('aduan_details');
        // $aduan_date = $request->input('aduan_date');
        $aduan_warden_remark = $request->input('aduan_warden_remark');
        // $aduan_upload = $request->input('aduan_upload');
        $aduan_alert = $request->input('aduan_alert');
        $lastupdateby = $request->input('lastupdateby');

        $FK_clg = $request->input('FK_clg');
        $FK_block = $request->input('FK_block');
        $FK_hostel = $request->input('FK_hostel');
        $FK_room = $request->input('FK_room');


        // $aduan_upload = $request->input('aduan_upload');
        $aduan_upload = $request->input('exist_aduan_upload'); //nie wajib
        if ($request->hasFile('exist_aduan_upload')) {
            $file = $request->file('aduan_upload');
            $aduan_upload = time() . $file->getClientOriginalName();
            $file->move('aduanHostel', $aduan_upload);
        }



        $obj = hep_aduanResponden::where([['pk_id', '=', $pk_id]])->update([

            'FK_jenisaduanHostel' => $FK_jenisaduanHostel,
            // 'FK_idStudent' => $FK_idStudent,
            'aduan_rujukan' => $aduan_rujukan,
            // 'aduan_status' => $aduan_status,
            'aduan_warden_assigned' => $aduan_warden_assigned,
            'aduan_details' => $aduan_details,
            // 'aduan_date' => date("Y-m-d"),
            'aduan_warden_remark' => $aduan_warden_remark,
            'aduan_upload' => $aduan_upload,
            'aduan_alert' => $aduan_alert,
            'lastupdateby' => $lastupdateby,
            'recordstatus' => 'EDT',


            'FK_clg' => $FK_clg,
            'FK_block' => $FK_block,
            'FK_hostel' => $FK_hostel,
            'FK_room' => $FK_room,
        ]);
        // dd($obj);
        if ($obj) {
            return response()->json([
                'success' => true,
                'message' => "Update Success!",
                'data' => hep_aduanResponden::where('pk_id', $pk_id)->get()
            ], 200);
        } else {
            return response()->json([
                'success' => false,
                'message' => "Update Failed!",
                'data' => ''
            ], 404);
        }
    }

    public function delete(Request $request)
    {
        // $recordstatus = $request->input('recordstatus');
        $pk_id = $request->input('pk_id');

        $obj = hep_aduanResponden::where('pk_id', $pk_id)->update([
            'recordstatus' => 'DEL',
        ]);

        if ($obj) {
            return response()->json([
                'success' => true,
                'message' => "Hapus Berjaya!",
                'data' => $obj
            ], 200);
        } else {
            return response()->json([
                'success' => false,
                'message' => "Hapus Gagal!",
                'data' => ''
            ], 401);
        }
    }


    public function listByIDstudent($FK_student)
    {

        $obj = hep_aduanResponden::select(
                'hep_aduanResponden.pk_id',
                'FK_jenisaduanHostel',
                'FK_idStudent',
                'aduan_rujukan',
                'aduan_status',
                'aduan_warden_assigned',
                'aduan_details',
                'aduan_date',
                'aduan_warden_remark',
                'aduan_upload',
                'aduan_alert',
                'hep_aduanResponden.lastapproveby',
                'hep_aduanResponden.lastupdateby',
                'hep_aduanResponden.created_at',
                'hep_aduanResponden.updated_at',
                'hep_aduanResponden.recordstatus',
                'aduan_code',
                'aduan_nama',
                'aduan_remarks',
                'clg_name',
                'block_name',
                'hostel_name',
                'FK_room',
                'FK_clg',
                'FK_block',
                'FK_hostel',
            )
            ->leftjoin('hep_jenisaduanHostel', 'hep_jenisaduanHostel.pk_id', 'hep_aduanResponden.FK_jenisaduanHostel')
            ->leftjoin('mis_prm_college', 'mis_prm_college.pk_id', 'hep_aduanResponden.FK_clg')
            ->leftjoin('hep_hostel', 'hep_hostel.hostel_id', 'hep_aduanResponden.FK_hostel')
            ->leftjoin('hep_hostel_blok', 'hep_hostel_blok.block_id', 'hep_aduanResponden.FK_block')
            // ->leftjoin('hep_hostel_room','hep_hostel_room.room_id','hep_aduanResponden.FK_room')
            ->where('FK_idStudent', $FK_student)
            ->where('hep_aduanResponden.recordstatus', '!=', 'DEL')
            ->get();

        if ($obj) {
            return response()->json([
                'success' => 'true',
                'message' => 'Show Success!',
                'data' => $obj
            ], 200);
        }
    }


    public function complaintNewAlert()
    {
        $obj = hep_aduanResponden::where([['recordstatus', '!=', 'DEL'], ['aduan_status', '=', 'New']])->get(['pk_id']);

        if ($obj) {
            return response()->json([
                'success' => 'true',
                'message' => 'List Success!',
                'data' => $obj
            ], 200);
        }
    }

    public function reportComplaint(Request $request)
    {

        $month = $request->input('month');
        $year = $request->input('year');

        $obj = hep_aduanResponden::select(
            'mis_std_info.std_studentid',
            'mis_std_info.sti_name',
            'mis_std_info.sti_icno',
            'hep_hostel.hostel_name',
            'mis_prm_college.clg_name',
            'hep_hostel_blok.block_name',
            'hep_hostel_room.room_no',
            'hep_aduanResponden.aduan_status',
            'hep_aduanResponden.aduan_details',
            'hep_aduanResponden.aduan_date',
            'hep_jenisaduanHostel.aduan_nama'
        )
            ->leftJoin('mis_std_info', 'hep_aduanResponden.FK_idStudent', '=', 'mis_std_info.std_studentid')
            ->leftJoin('mis_prm_college', 'hep_aduanResponden.FK_clg', '=', 'mis_prm_college.pk_id')
            ->leftJoin('hep_hostel', 'hep_aduanResponden.FK_hostel', '=', 'hep_hostel.hostel_id')
            ->leftJoin('hep_hostel_blok', 'hep_aduanResponden.FK_block', '=', 'hep_hostel_blok.block_id')
            ->leftJoin('hep_hostel_room', 'hep_aduanResponden.FK_room', '=', 'hep_hostel_room.room_id')
            ->leftJoin('hep_jenisaduanHostel', 'hep_jenisaduanHostel.pk_id', '=', 'hep_aduanResponden.FK_jenisaduanHostel')
            ->where('hep_aduanResponden.recordstatus', '!=', 'DEL');
            if($month){
                // DD($month);
                $obj = $obj->whereMonth('hep_aduanResponden.aduan_date', '=', $month);
            }
            if($year){
                // DD('TEST2');
                $obj = $obj->whereYear('hep_aduanResponden.aduan_date', '=', $year);
            }
            // else{
            //     $obj->whereYear('hep_aduanResponden.aduan_date', '=', date("Y"));
            // }
            
            $obj = $obj->get();

        // $records now contains the result of the query

// dd($obj);

        if ($obj) {
            return response()->json([
                'success' => 'true',
                'message' => 'List Success!',
                'data' => $obj
            ], 200);
        }
    }
}
