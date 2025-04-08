<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use App\Models\hep_hostel_checkInOut;
use App\Models\hep_hostel_room;
use Psy\Readline\Hoa\Console;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Carbon\Carbon;

class hep_hostel_checkInOutController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }

    public function register(Request $request)
    {
        $fk_booking = $request->input('fk_booking');
        $fk_hstlChg = $request->input('fk_hstlChg');
        $type = $request->input('type');
        $stud_id = $request->input('stud_id');
        $branch_id = $request->input('branch_id');
        $hostel_id = $request->input('hostel_id');
        $block_id = $request->input('block_id');
        $room_id = $request->input('room_id');
        $checkIn_status = $request->input('checkIn_status');
        // $checkIn = $request->input('checkIn');
        $recordstatus = $request->input('recordstatus');
        $checkIn = $request->input('checkIn');
        $formattedCheckIn = date('Y-m-d', strtotime($checkIn));
        if ($type === 'Change') {

            $obj_std = hep_hostel_checkInOut::where([['stud_id', '=', $stud_id]])->latest('chkInOut_id')->value('chkInOut_id');

            // dd( $obj_std);
            // $updLastpnyaCheckin = $obj_std
            if ($obj_std) {
                $updLastpnyaCheckin = hep_hostel_checkInOut::where('chkInOut_id', '=', $obj_std)

                    // $updLastpnyaCheckin = $obj_std
                    ->update([
                        'checkOut' => date("Y-m-d"),
                        'checkOut_status' => 'Accept',
                        'checkIn_status' => 'Check Out',
                        'recordstatus' => 'EDT',
                    ]);
            }
        }
        $obj = hep_hostel_checkInOut::create([
            'fk_booking' => $fk_booking,
            'fk_hstlChg' => $fk_hstlChg,
            'type' => $type,
            'stud_id' => $stud_id,
            'branch_id' => $branch_id,
            'hostel_id' => $hostel_id,
            'block_id' => $block_id,
            'room_id' => $room_id,
            'checkIn_status' => $checkIn_status,
            'checkIn' => $formattedCheckIn,
            'recordstatus' => $recordstatus
        ]);

        if ($obj) {
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

    public function unreside(Request $request)
    {
        $stud_id = $request->input('stud_id');
        $checkIn_status = $request->input('checkIn_status');
        $reason = $request->input('reason');
        $recordstatus = $request->input('recordstatus');

        $obj = hep_hostel_checkInOut::create([
            'stud_id' => $stud_id,
            'checkIn_status' => $checkIn_status,
            'reason' => $reason,
            'recordstatus' => $recordstatus
        ]);

        if ($obj) {
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


    public function list()
    {
        $obj = hep_hostel_checkInOut::where([['hep_hostel_chkinout.recordstatus', '!=', 'DEL']])
            ->leftjoin('hep_hostel_booking', 'hep_hostel_booking.booking_id', '=', 'hep_hostel_chkinout.fk_booking')
            ->leftjoin('mis_prm_college', 'mis_prm_college.pk_id', '=', 'hep_hostel_chkinout.branch_id')
            ->leftjoin('hep_hostel', 'hep_hostel.hostel_id', '=', 'hep_hostel_chkinout.hostel_id')
            ->leftjoin('hep_hostel_blok', 'hep_hostel_blok.block_id', '=', 'hep_hostel_chkinout.block_id')
            ->leftjoin('hep_hostel_room', 'hep_hostel_room.room_id', '=', 'hep_hostel_chkinout.room_id')
            ->leftjoin('mis_std_info', 'mis_std_info.std_studentid', '=', 'hep_hostel_chkinout.stud_id')
            ->leftjoin('hep_hostel_change', 'hep_hostel_change.change_id', '=', 'hep_hostel_chkinout.fk_hstlChg')
            ->where('hep_hostel_chkinout.checkIn_status', '!=', 'Unreside')
            ->where('hep_hostel_chkinout.checkIn_status', '!=', 'NEw]') //afiez 05 october 2023

            ->get([
                'chkInOut_id',
                'clg_name',
                'hostel_name',
                'block_name',
                'room_no',
                'hep_hostel_chkinout.stud_id AS std_id',
                'sti_name',
                'checkIn',
                'checkOut',
                'checkIn_status',
                'checkOut_status',
                'expected_chkInDate',
                'notify_warden'
            ]);

        if ($obj) {
            return response()->json([
                'success' => 'true',
                'message' => 'List Success!',
                'data' => $obj
            ], 200);
        }
    }
    public function listExcludeNewcheckin()
    {
        // $obj = hep_hostel_checkInOut::where([['hep_hostel_chkinout.recordstatus', '!=', 'DEL']])
        //     ->leftjoin('hep_hostel_booking', 'hep_hostel_booking.booking_id', '=', 'hep_hostel_chkinout.fk_booking')
        //     ->leftjoin('mis_prm_college', 'mis_prm_college.pk_id', '=', 'hep_hostel_chkinout.branch_id')
        //     ->leftjoin('hep_hostel', 'hep_hostel.hostel_id', '=', 'hep_hostel_chkinout.hostel_id')
        //     ->leftjoin('hep_hostel_blok', 'hep_hostel_blok.block_id', '=', 'hep_hostel_chkinout.block_id')
        //     ->leftjoin('hep_hostel_room', 'hep_hostel_room.room_id', '=', 'hep_hostel_chkinout.room_id')
        //     ->leftjoin('mis_std_info', 'mis_std_info.std_studentid', '=', 'hep_hostel_chkinout.stud_id')
        //     ->leftjoin('hep_hostel_change', 'hep_hostel_change.change_id', '=', 'hep_hostel_chkinout.fk_hstlChg')
        //     ->where('hep_hostel_chkinout.checkIn_status', '!=', 'Unreside')
        //     ->where('hep_hostel_chkinout.checkIn_status', '!=', 'New') 
        //     ->orderByRaw("
        //     CASE 
        //         WHEN checkOut_status = 'New' THEN 0
        //         ELSE 1
        //     END
        // ")
        //     ->get([
        //         'chkInOut_id',
        //         'clg_name',
        //         'hostel_name',
        //         'block_name',
        //         'room_no',
        //         'hep_hostel_chkinout.stud_id AS std_id',
        //         'sti_name',
        //         'checkIn',
        //         'checkOut',
        //         'checkIn_status',
        //         'checkOut_status',
        //         'expected_chkInDate',
        //         'notify_warden',
        //         'reason'

        //     ]);

        $obj = hep_hostel_checkInOut::where([['hep_hostel_chkinout.recordstatus', '!=', 'DEL']])
            ->leftjoin('hep_hostel_booking', 'hep_hostel_booking.booking_id', '=', 'hep_hostel_chkinout.fk_booking') // Joining with booking details
            ->leftjoin('mis_prm_college', 'mis_prm_college.pk_id', '=', 'hep_hostel_chkinout.branch_id') // Joining with college details
            ->leftjoin('hep_hostel', 'hep_hostel.hostel_id', '=', 'hep_hostel_chkinout.hostel_id') // Joining with hostel details
            ->leftjoin('hep_hostel_blok', 'hep_hostel_blok.block_id', '=', 'hep_hostel_chkinout.block_id') // Joining with block details
            ->leftjoin('hep_hostel_room', 'hep_hostel_room.room_id', '=', 'hep_hostel_chkinout.room_id') // Joining with room details
            ->leftjoin('mis_std_info', 'mis_std_info.std_studentid', '=', 'hep_hostel_chkinout.stud_id') // Joining with student details
            ->leftjoin('hep_hostel_change', 'hep_hostel_change.change_id', '=', 'hep_hostel_chkinout.fk_hstlChg') // Joining with hostel change details
            ->where('hep_hostel_chkinout.checkIn_status', '!=', 'Unreside') // Filtering out 'Unreside' check-in status
            ->where('hep_hostel_chkinout.checkIn_status', '!=', 'New') // Filtering out 'New' check-in status
            ->orderByRaw("
                CASE 
                    WHEN checkOut_status = 'New' THEN 0
                    ELSE 1
                END
            ") // Ordering by checkOut_status, prioritizing 'New'
            ->orderByRaw("GREATEST(COALESCE(checkOut, '1970-01-01'), COALESCE(checkIn, '1970-01-01')) DESC") // Sorting by the latest date between checkOut and checkIn
            ->get([
                'chkInOut_id',
                'clg_name',
                'hostel_name',
                'block_name',
                'room_no',
                'hep_hostel_chkinout.stud_id AS std_id',
                'sti_name',
                'checkIn',
                'checkOut',
                'checkIn_status',
                'checkOut_status',
                'expected_chkInDate',
                'notify_warden',
                'reason'
            ]); // Selecting specific columns


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
        $chkInOut_id = $request->input('chkInOut_id');
        $branch_id = $request->input('branch_id');
        $hostel_id = $request->input('hostel_id');
        $block_id = $request->input('block_id');
        $room_id = $request->input('room_id');
        $checkIn = $request->input('checkIn');
        $recordstatus = $request->input('recordstatus');
        $checkIn_status = $request->input('checkIn_status');
        $reason = $request->input('reason');

        $obj = hep_hostel_checkInOut::where([['chkInOut_id', '=', $chkInOut_id]])->update([
            'branch_id' => $branch_id,
            'hostel_id' => $hostel_id,
            'block_id' => $block_id,
            'room_id' => $room_id,
            'checkIn' => $checkIn,
            'recordstatus' => $recordstatus,
            'checkIn_status' => $checkIn_status,
            'reason' => $reason

        ]);

        if ($obj) {
            return response()->json([
                'success' => true,
                'message' => "Update Success!",
                'data' => $obj
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
        $chkInOut_id = $request->input('chkInOut_id');
        $recordstatus = 'DEL';

        $obj = hep_hostel_checkInOut::where([['chkInOut_id', '=', $chkInOut_id]])
            ->update(['recordstatus' => $recordstatus]);

        if ($obj) {
            return response()->json([
                'success' => true,
                'message' => "Update Success!",
                'data' => $obj
            ], 200);
        } else {
            return response()->json([
                'success' => false,
                'message' => "Update Failed!",
                'data' => ''
            ], 404);
        }
    }




    // student check in
    public function uptChkIn(Request $request)
    {
        $chkInOut_id = $request->input('chkInOut_id');
        $checkIn = $request->input('checkIn');
        $checkIn_status = $request->input('checkIn_status');
        $check_agree = $request->input('check_agree');
        $notify_warden = $request->input('notify_warden');
        $recordstatus = $request->input('recordstatus');

        $obj = hep_hostel_checkInOut::where([['chkInOut_id', '=', $chkInOut_id]])->update([
            'checkIn' => $checkIn,
            'checkIn_status' => $checkIn_status,
            'check_agree' => $check_agree,
            'notify_warden' => $notify_warden,
            'recordstatus' => $recordstatus
        ]);

        if ($obj) {
            return response()->json([
                'success' => true,
                'message' => "Update Success!",
                'data' => $obj
            ], 200);
        } else {
            return response()->json([
                'success' => false,
                'message' => "Update Failed!",
                'data' => ''
            ], 404);
        }
    }


    public function chkOut(Request $request)
    {
        $chkInOut_id = $request->input('chkInOut_id');
        $checkOut = $request->input('checkOut');
        $checkOut_status = $request->input('checkOut_status');
        $checkIn_status = $request->input('checkIn_status');
        $notify_admin = $request->input('notify_admin');
        $notify_std = $request->input('notify_std');
        $notify_warden = $request->input('notify_warden');
        $recordstatus = $request->input('recordstatus');
        $reason = $request->input('reason');
        if ($checkOut_status === 'Accept') {
            $checkOut_status === 'Accept';
        } else if ($checkOut_status === 'Reject') {
            $checkOut = NULL;
        }

        $obj = hep_hostel_checkInOut::where([['chkInOut_id', '=', $chkInOut_id]])->update([
            'checkOut' => $checkOut,
            'checkOut_status' => $checkOut_status,
            'checkIn_status' => $checkIn_status,
            'notify_admin' => $notify_admin,
            'notify_std' => $notify_std,
            'notify_warden' => $notify_warden,
            'recordstatus' => $recordstatus,
            'reason' => $reason
        ]);





        if ($checkOut_status) {


            if ($checkOut_status !== 'New') {
                $EmailPurpose = hep_hostel_checkInOut::where('chkInOut_id', $chkInOut_id)
                    ->leftJoin('mis_prm_college', 'mis_prm_college.pk_id', '=', 'hep_hostel_chkinout.branch_id')
                    ->leftJoin('hep_hostel', 'hep_hostel.hostel_id', '=', 'hep_hostel_chkinout.hostel_id')
                    ->leftJoin('hep_hostel_blok', 'hep_hostel_blok.block_id', '=', 'hep_hostel_chkinout.block_id')
                    ->leftJoin('hep_hostel_room', 'hep_hostel_room.room_id', '=', 'hep_hostel_chkinout.room_id')
                    ->leftJoin('mis_std_info', 'mis_std_info.std_studentid', '=', 'hep_hostel_chkinout.stud_id')
                    ->select(
                        'mis_std_info.sti_name',
                        'hep_hostel_chkinout.stud_id',
                        'mis_prm_college.clg_name',
                        'hep_hostel.hostel_name',
                        'hep_hostel_blok.block_name',
                        'hep_hostel_room.room_no',
                        'hep_hostel_chkinout.*'
                    )
                    ->first(); // Or get() if you expect multiple results

                $data = array(
                    'name' => $EmailPurpose->sti_name,
                    'idStdStaff' => $EmailPurpose->stud_id,
                    'title' => "Your <b>Hostel Check-Out Application</b> has been updated according to the details below:",
                    'Hostel' => $EmailPurpose->hostel_name,
                    'Block' => $EmailPurpose->block_name,
                    'Room' => $EmailPurpose->room_no,
                    'content' => "
                  
        <table border='1' style='font-family: arial, sans-serif; border-collapse: collapse; width: 100%;'>
            <tr>
                <th colspan='2'><strong>Hostel Application Details</strong></th>
            </tr>
            <tr>
                <td style='background-color: #dddddd; text-align: left; padding: 0 8px;'>Campus</td>
                <td style='text-align: left; padding: 0 8px;'>{$EmailPurpose->clg_name}</td>
            </tr>
            <tr>
                <td style='background-color: #dddddd; text-align: left; padding: 0 8px;'>Student ID</td>
                <td style='text-align: left; padding: 0 8px;'>{$EmailPurpose->stud_id}</td>
            </tr>
            <tr>
                <td style='background-color: #dddddd; text-align: left; padding: 0 8px;'>Student Name</td>
                <td style='text-align: left; padding: 0 8px;'>{$EmailPurpose->sti_name}</td>
            </tr>
            <tr>
                <td style='background-color: #dddddd; text-align: left; padding: 0 8px;'>Hostel</td>
                <td style='text-align: left; padding: 0 8px;'>{$EmailPurpose->hostel_name}</td>
            </tr>
            <tr>
                <td style='background-color: #dddddd; text-align: left; padding: 0 8px;'>Block</td>
                <td style='text-align: left; padding: 0 8px;'>{$EmailPurpose->block_name}</td>
            </tr>
            <tr>
                <td style='background-color: #dddddd; text-align: left; padding: 0 8px;'>Room</td>
                <td style='text-align: left; padding: 0 8px;'>{$EmailPurpose->room_no}</td>
            </tr>
            <tr>
                <td style='background-color: #dddddd; text-align: left; padding: 0 8px;'>Status</td>
                <td style='text-align: left; padding: 0 8px;'><strong>{$checkOut_status}</strong></td>
            </tr>
        </table>
                    ",
                );

                $checkingSuccess = Mail::send('mail', $data, function ($message) use ($data, $EmailPurpose) {
                    // $message->to($array->std_id.'@gmail.com',  $array->std_name)->subject('Hostel Booking Application');
                    $message->to($EmailPurpose->stud_id . '@student.ucmi.edu.my',  $EmailPurpose->sti_name)->subject('Hostel Check-Out Application');
                    // $message->to('mohdafiez7@gmail.com', 'Test Name')->subject('Hostel Booking Application');
                    $message->from('hostel@ucmi.edu.my', 'UNIT PENGURUSAN HOSTEL');
                    // $message->from('ehepa@ucmi.edu.my', 'hepa');

                });


                // if ($checkingSuccess) {
                //     return response()->json([
                //         'success' => true,
                //         'message' => "Update Success!",
                //         'data' => $obj
                //     ], 200);
                // } else {
                //     return response()->json([
                //         'success' => false,
                //         'message' => "Update Failed!",
                //         'data' => $obj
                //     ], 404);
                // }
            } else if ($checkOut_status === 'New') {

                $EmailPurpose = hep_hostel_checkInOut::where('chkInOut_id', $chkInOut_id)
                    ->leftJoin('mis_prm_college', 'mis_prm_college.pk_id', '=', 'hep_hostel_chkinout.branch_id')
                    ->leftJoin('hep_hostel', 'hep_hostel.hostel_id', '=', 'hep_hostel_chkinout.hostel_id')
                    ->leftJoin('hep_hostel_blok', 'hep_hostel_blok.block_id', '=', 'hep_hostel_chkinout.block_id')
                    ->leftJoin('hep_hostel_room', 'hep_hostel_room.room_id', '=', 'hep_hostel_chkinout.room_id')
                    ->leftJoin('mis_std_info', 'mis_std_info.std_studentid', '=', 'hep_hostel_chkinout.stud_id')
                    ->select(
                        'mis_std_info.sti_name',
                        'hep_hostel_chkinout.stud_id',
                        'mis_prm_college.clg_name',
                        'hep_hostel.hostel_name',
                        'hep_hostel_blok.block_name',
                        'hep_hostel_room.room_no',
                        'hep_hostel_chkinout.*'
                    )
                    ->first(); // Or get() if you expect multiple results

                $data = array(
                    'name' => $EmailPurpose->sti_name,
                    'idStdStaff' => $EmailPurpose->stud_id,
                    'title' => 'You have received a <b>Hostel Check-Out Application</b> according to the details below:',
                    'Hostel' => $EmailPurpose->hostel_name,
                    'Block' => $EmailPurpose->block_name,
                    'Room' => $EmailPurpose->room_no,
                    'content' => "
                   
        <table border='1' style='font-family: arial, sans-serif; border-collapse: collapse; width: 100%;'>
            <tr>
                <th colspan='2'><strong>Hostel Application Details</strong></th>
            </tr>
            <tr>
                <td style='background-color: #dddddd; text-align: left; padding: 0 8px;'>Campus</td>
                <td style='text-align: left; padding: 0 8px;'>{$EmailPurpose->clg_name}</td>
            </tr>
            <tr>
                <td style='background-color: #dddddd; text-align: left; padding: 0 8px;'>Student ID</td>
                <td style='text-align: left; padding: 0 8px;'>{$EmailPurpose->stud_id}</td>
            </tr>
            <tr>
                <td style='background-color: #dddddd; text-align: left; padding: 0 8px;'>Student Name</td>
                <td style='text-align: left; padding: 0 8px;'>{$EmailPurpose->sti_name}</td>
            </tr>
            <tr>
                <td style='background-color: #dddddd; text-align: left; padding: 0 8px;'>Hostel</td>
                <td style='text-align: left; padding: 0 8px;'>{$EmailPurpose->hostel_name}</td>
            </tr>
            <tr>
                <td style='background-color: #dddddd; text-align: left; padding: 0 8px;'>Block</td>
                <td style='text-align: left; padding: 0 8px;'>{$EmailPurpose->block_name}</td>
            </tr>
            <tr>
                <td style='background-color: #dddddd; text-align: left; padding: 0 8px;'>Room</td>
                <td style='text-align: left; padding: 0 8px;'>{$EmailPurpose->room_no}</td>
            </tr>
            <tr>
                <td style='background-color: #dddddd; text-align: left; padding: 0 8px;'>Status</td>
                <td style='text-align: left; padding: 0 8px;'><strong>{$checkOut_status}</strong></td>
            </tr>
        </table>
                 ",
                );

                Mail::send('mail', $data, function ($message) use ($data, $EmailPurpose) {
                    // $message->to($array->std_id.'@gmail.com',  $array->std_name)->subject('Hostel Booking Application');
                    $message->to('hostel@ucmi.edu.my', 'UNIT PENGURUSAN HOSTEL')->subject('Hostel Check-Out Application');
                    // $message->to('ehepa@ucmi.edu.my', 'hepa')->subject('Hostel Check-Out Application');

                    // $message->to('mohdafiez7@gmail.com', 'Test Name')->subject('Hostel Booking Application');
                    $message->from($EmailPurpose->stud_id . '@student.ucmi.edu.my',  $EmailPurpose->sti_name);
                });
            }



            return response()->json([
                'success' => true,
                'message' => "Update Success!",
                'data' => $obj
            ], 200);
        } else {
            return response()->json([
                'success' => false,
                'message' => "Update Failed!",
                'data' => ''
            ], 404);
        }
    }


    // count status checkout==New
    public function alertChkOutNew()
    {
        $obj = hep_hostel_checkInOut::where([['recordstatus', '!=', 'DEL'], ['checkOut_status', '=', 'New']])
            ->orWhere([['notify_warden', '=', 'Yes'], ['recordstatus', '!=', 'DEL']])
            ->get('chkInOut_id');

        if ($obj) {
            return response()->json([
                'success' => 'true',
                'message' => 'List Success!',
                'data' => $obj
            ], 200);
        }
    }
    // count status checkout==New
    public function alertChkOutNewOnly()
    {
        $obj = hep_hostel_checkInOut::where([['recordstatus', '!=', 'DEL'], ['checkOut_status', '=', 'New']])
            ->get('chkInOut_id');

        if ($obj) {
            return response()->json([
                'success' => 'true',
                'message' => 'List Success!',
                'data' => $obj
            ], 200);
        }
    }

    public function listByStd($id)
    {
        $obj = hep_hostel_checkInOut::where([['hep_hostel_chkinout.stud_id', '=', $id], ['hep_hostel_chkinout.recordstatus', '!=', 'DEL']])
            ->leftjoin('hep_hostel_booking', 'hep_hostel_booking.booking_id', '=', 'hep_hostel_chkinout.fk_booking')
            ->leftjoin('mis_prm_college', 'mis_prm_college.pk_id', '=', 'hep_hostel_chkinout.branch_id')
            ->leftjoin('hep_hostel', 'hep_hostel.hostel_id', '=', 'hep_hostel_chkinout.hostel_id')
            ->leftjoin('hep_hostel_blok', 'hep_hostel_blok.block_id', '=', 'hep_hostel_chkinout.block_id')
            ->leftjoin('hep_hostel_room', 'hep_hostel_room.room_id', '=', 'hep_hostel_chkinout.room_id')
            ->leftjoin('hep_warden', 'hep_warden.pk_id', '=', 'hep_hostel.hostel_warden')
            ->leftjoin('hrm_emp_info', 'hrm_emp_info.emp_id', '=', 'hep_warden.emp_warden')
            ->orderByRaw("
            CASE 
                WHEN checkIn_status = 'New' THEN 0
                WHEN checkOut_status = 'New' THEN 1
                ELSE 2
            END
                        ")
            ->orderby('checkIn', 'desc')
            ->orderby('checkOut', 'desc')
            ->get([
                'chkInOut_id',
                'fk_booking',
                'clg_name',
                'hostel_name',
                'block_name',
                'room_no',
                'hep_hostel_chkinout.stud_id AS std_id',
                'checkIn',
                'checkOut',
                'checkIn_status',
                'checkOut_status',
                'expected_chkInDate',
                'type',
                'hostel_warden',
                'hostel_wardenNo',
                'emp_name'
            ]);

        if ($obj) {
            return response()->json([
                'success' => 'true',
                'message' => 'List Success!',
                'data' => $obj
            ], 200);
        }
    }


    public function checkLateststatus($id)
    {
        $obj = hep_hostel_checkInOut::where([['hep_hostel_chkinout.stud_id', '=', $id], ['hep_hostel_chkinout.recordstatus', '!=', 'DEL']])
            ->leftjoin('hep_hostel_booking', 'hep_hostel_booking.booking_id', '=', 'hep_hostel_chkinout.fk_booking')
            ->leftjoin('mis_prm_college', 'mis_prm_college.pk_id', '=', 'hep_hostel_chkinout.branch_id')
            ->leftjoin('hep_hostel', 'hep_hostel.hostel_id', '=', 'hep_hostel_chkinout.hostel_id')
            ->leftjoin('hep_hostel_blok', 'hep_hostel_blok.block_id', '=', 'hep_hostel_chkinout.block_id')
            ->leftjoin('hep_hostel_room', 'hep_hostel_room.room_id', '=', 'hep_hostel_chkinout.room_id')
            ->leftjoin('hep_warden', 'hep_warden.pk_id', '=', 'hep_hostel.hostel_warden')
            ->leftjoin('hrm_emp_info', 'hrm_emp_info.emp_id', '=', 'hep_warden.emp_warden')
            ->orderByRaw("
            CASE 
                WHEN checkIn_status = 'New' THEN 0
                WHEN checkOut_status = 'New' THEN 1
                ELSE 2
            END
                        ")
            ->orderby('checkIn', 'desc')
            ->orderby('checkOut', 'desc')
            ->first([
                'chkInOut_id',
                'fk_booking',
                'clg_name',
                'hostel_name',
                'block_name',
                'room_no',
                'hep_hostel_chkinout.stud_id AS std_id',
                'checkIn',
                'checkOut',
                'checkIn_status',
                'checkOut_status',
                'expected_chkInDate',
                'type',
                'hostel_warden',
                'hostel_wardenNo',
                'emp_name'
            ]);

        if ($obj) {
            return response()->json([
                'success' => 'true',
                'message' => 'List Success!',
                'data' => $obj
            ], 200);
        }
    }


    // count room assign for student
    public function countChkIn($id)
    {
        $obj = hep_hostel_checkInOut::where([
            ['hep_hostel_chkinout.room_id', '=', $id],
            // ['checkIn_status', '!=', 'Check Out'],
            // ['checkOut_status', '!=', 'Accept'],   //tutup sbab null pun dia xbgi masuk
            ['hep_hostel_chkinout.recordstatus', '!=', 'DEL'],
            ['mis_std_info.recordstatus', '!=', 'DEL']
        ])
            ->where(function ($query) {
                $query->where('checkOut_status', '!=', 'Accept')
                    ->orWhereNull('checkOut_status');
            })
            ->leftjoin('mis_std_info', 'mis_std_info.std_studentid', '=', 'hep_hostel_chkinout.stud_id')
            ->get([
                'chkInOut_id',
                'stud_id',
                'sti_name',
                'sti_icno',
                'sti_contactno_mobile',
                'checkIn',
            ]);

        if ($obj) {
            return response()->json([
                'success' => 'true',
                'message' => 'List Success!',
                'count' => $obj->count(),
                'data' => $obj
            ], 200);
        }
    }


    // check if student ada record new Check In, so admin x bleh assign bilik lain
    public function chkStdChkIn($id)
    {
        $obj = hep_hostel_checkInOut::where([
            ['stud_id', '=', $id],
            ['checkIn_status', '=', 'New'],
            ['recordstatus', '!=', 'DEL']
        ])
            ->get(['chkInOut_id']);

        if ($obj) {
            return response()->json([
                'success' => 'true',
                'message' => 'List Success!',
                'data' => $obj
            ], 200);
        }
    }


    // show alert if student ada record New && Check Out
    public function alertStdNew($id)
    {
        $obj = hep_hostel_checkInOut::where([
            ['stud_id', '=', $id],
            ['checkIn_status', '=', 'New'],
            ['recordstatus', '!=', 'DEL']
        ])
            ->orWhere([
                ['stud_id', '=', $id],
                ['notify_std', '=', 'Yes'],
                ['recordstatus', '!=', 'DEL']
            ])
            ->first(['chkInOut_id']);

        if ($obj) {
            return response()->json([
                'success' => true,
                'message' => 'List Success!',
                'data' => $obj
            ], 200);
        } else {
            return response()->json([
                'success' => false,
                'message' => "Update Failed!",
                'data' => ''
            ], 404);
        }
    }


    // check if ada student Check In Status==Check In, kena check out dulu sblm check in bilik baru 
    public function chkStdSttsChkIn($id)
    {
        $obj = hep_hostel_checkInOut::where([
            ['stud_id', '=', $id],
            ['checkIn_status', '=', 'Check In'],
            ['recordstatus', '!=', 'DEL']
        ])
            ->get(['chkInOut_id']);

        if ($obj) {
            return response()->json([
                'success' => 'true',
                'message' => 'List Success!',
                'data' => $obj
            ], 200);
        }
    }


    // alert Check In Status==Check Out
    public function notifyAdminChkOut()
    {
        $obj = hep_hostel_checkInOut::where([
            ['checkIn_status', '=', 'Check Out'],
            ['notify_admin', '=', 'Yes'],
            ['recordstatus', '!=', 'DEL']
        ])
            ->get(['chkInOut_id']);

        if ($obj) {
            return response()->json([
                'success' => 'true',
                'message' => 'List Success!',
                'data' => $obj
            ], 200);
        }
    }


    // update notify_admin==No 
    public function uptNotifyAdmin($id)
    {
        $obj = hep_hostel_checkInOut::where([['chkInOut_id', '=', $id]])->update(['notify_admin' => 'No']);

        if ($obj) {
            return response()->json([
                'success' => true,
                'message' => "Update Success!",
                'data' => $obj
            ], 200);
        } else {
            return response()->json([
                'success' => false,
                'message' => "Update Failed!",
                'data' => ''
            ], 404);
        }
    }


    // update notify_std==No 
    public function uptNotifyStd($id)
    {
        $obj = hep_hostel_checkInOut::where([['chkInOut_id', '=', $id]])->update(['notify_std' => 'No']);

        if ($obj) {
            return response()->json([
                'success' => true,
                'message' => "Update Success!",
                'data' => $obj
            ], 200);
        } else {
            return response()->json([
                'success' => false,
                'message' => "Update Failed!",
                'data' => ''
            ], 404);
        }
    }


    // update notify_warden==No 
    public function uptNotifyWarden($id)
    {
        $obj = hep_hostel_checkInOut::where([['chkInOut_id', '=', $id]])->update(['notify_warden' => 'No']);

        if ($obj) {
            return response()->json([
                'success' => true,
                'message' => "Update Success!",
                'data' => $obj
            ], 200);
        } else {
            return response()->json([
                'success' => false,
                'message' => "Update Failed!",
                'data' => ''
            ], 404);
        }
    }


    // check student status!=Check Out
    public function chkStdNotChkOut($id)
    {
        $obj = hep_hostel_checkInOut::where([
            ['stud_id', '=', $id],
            ['checkIn_status', '!=', 'Check Out'],
            ['recordstatus', '!=', 'DEL']
        ])
            ->get([
                'chkInOut_id',
                'branch_id',
                'hostel_id',
                'block_id',
                'room_id',
                'checkIn_status',
                'checkIn'
            ]);

        if ($obj) {
            return response()->json([
                'success' => 'true',
                'message' => 'List Success!',
                'data' => $obj
            ], 200);
        }
    }


    // check if hostel occupied
    public function chkHstlOccupied($id)
    {
        $obj = hep_hostel_checkInOut::where([
            ['hostel_id', '=', $id],
            ['checkIn_status', '!=', 'Check Out'],
            ['recordstatus', '!=', 'DEL']
        ])
            ->get(['chkInOut_id']);

        if ($obj) {
            return response()->json([
                'success' => 'true',
                'message' => 'List Success!',
                'data' => $obj
            ], 200);
        }
    }


    // check if block occupied
    public function chkBlckOccupied($id)
    {
        $obj = hep_hostel_checkInOut::where([
            ['block_id', '=', $id],
            ['checkIn_status', '!=', 'Check Out'],
            ['recordstatus', '!=', 'DEL']
        ])
            ->get(['chkInOut_id']);

        if ($obj) {
            return response()->json([
                'success' => 'true',
                'message' => 'List Success!',
                'data' => $obj
            ], 200);
        }
    }




    // afiez utk seaching 18sep2023
    public function det_student_info(Request $request)
    {

        $id = $request->input('chkInOut_id');
        $sti_name = $request->input('chkInOut_name');
        $sti_icno = $request->input('chkInOut_ic');

        // \DB::enableQueryLog();
        $obj = hep_hostel_checkInOut::select(
            //   '*'   
            'hep_hostel_chkinout.chkInOut_id',
            'hep_hostel_chkinout.fk_booking',
            'mis_prm_college.clg_name',
            'hep_hostel.hostel_name',
            'hep_hostel_blok.block_name',
            'hep_hostel_room.room_no',
            'hep_hostel_chkinout.stud_id AS std_id',
            'hep_hostel_chkinout.checkIn',
            'hep_hostel_chkinout.checkOut',
            'hep_hostel_chkinout.checkIn_status',
            'hep_hostel_chkinout.checkOut_status',
            'hep_hostel_chkinout.type',
            'hep_hostel.hostel_warden',
            'hep_hostel.hostel_wardenNo',
            'hrm_emp_info.emp_name',
            'mis_std_info.sti_icno',
            'mis_std_info.sti_name'
        )
            ->leftJoin('hep_hostel_booking', 'hep_hostel_booking.booking_id', '=', 'hep_hostel_chkinout.fk_booking')
            ->leftJoin('mis_prm_college', 'mis_prm_college.pk_id', '=', 'hep_hostel_chkinout.branch_id')
            ->leftJoin('hep_hostel', 'hep_hostel.hostel_id', '=', 'hep_hostel_chkinout.hostel_id')
            ->leftJoin('hep_hostel_blok', 'hep_hostel_blok.block_id', '=', 'hep_hostel_chkinout.block_id')
            ->leftJoin('hep_hostel_room', 'hep_hostel_room.room_id', '=', 'hep_hostel_chkinout.room_id')
            ->leftJoin('hep_warden', 'hep_warden.pk_id', '=', 'hep_hostel.hostel_warden')
            ->leftJoin('hrm_emp_info', 'hrm_emp_info.emp_id', '=', 'hep_warden.emp_warden')
            ->leftJoin('mis_std_info', 'mis_std_info.std_studentid', '=', 'hep_hostel_chkinout.stud_id')
            ->where('hep_hostel_chkinout.recordstatus', '!=', 'DEL')
            // ->where('hep_hostel_chkinout.checkIn_status', '!=', 'Check Out')
            // ->where('hep_hostel_chkinout.checkOut_status', '!=', 'Accept')
            ->where(function ($query) {
                $query->where('checkOut_status', '!=', 'Accept')
                    ->orWhereNull('checkOut_status');
            })
            ->when($id, function ($query) use ($id) {
                // $query->where('hep_hostel_chkinout.stud_id', '=', $id); //nie searching kena full
                $query->where('hep_hostel_chkinout.stud_id', 'LIKE', $id . '%');
            })
            ->when($sti_name, function ($query) use ($sti_name) {
                $query->where('mis_std_info.sti_name', 'like', '%' . $sti_name . '%');
            })
            ->when($sti_icno, function ($query) use ($sti_icno) {
                $query->where('mis_std_info.sti_icno', '=', $sti_icno);
            })
            ->orderBy('hep_hostel_chkinout.checkIn', 'desc')
            ->orderBy('hep_hostel_chkinout.checkOut', 'desc')
            ->get();


        if ($obj) {
            return response()->json([
                'success' => 'true',
                'message' => 'List Success!',
                'data' => $obj
            ], 200);
        }
    }


    //     public function det_student_info(Request $request){

    //         $id = $request->input('chkInOut_id');
    //         $sti_name = $request->input('chkInOut_name');
    //         $sti_icno = $request->input('chkInOut_ic');

    //         // \DB::enableQueryLog();
    //         $obj = hep_hostel_checkInOut::select(
    //             'hep_hostel_chkinout.chkInOut_id',
    //             'hep_hostel_chkinout.fk_booking',
    //             'mis_prm_college.clg_name',
    //             'hep_hostel.hostel_name',
    //             'hep_hostel_blok.block_name',
    //             'hep_hostel_room.room_no',
    //             'hep_hostel_chkinout.stud_id AS std_id',
    //             'hep_hostel_chkinout.checkIn',
    //             'hep_hostel_chkinout.checkOut',
    //             'hep_hostel_chkinout.checkIn_status',
    //             'hep_hostel_chkinout.checkOut_status',
    //             'hep_hostel_chkinout.type',
    //             'hep_hostel.hostel_warden',
    //             'hep_hostel.hostel_wardenNo',
    //             'hrm_emp_info.emp_name',
    //             'mis_std_info.sti_icno',
    //             'mis_std_info.sti_name'
    //         )
    //         ->leftJoin('hep_hostel_booking', 'hep_hostel_booking.booking_id', '=', 'hep_hostel_chkinout.fk_booking')
    //         ->leftJoin('mis_prm_college', 'mis_prm_college.pk_id', '=', 'hep_hostel_chkinout.branch_id')
    //         ->leftJoin('hep_hostel', 'hep_hostel.hostel_id', '=', 'hep_hostel_chkinout.hostel_id')
    //         ->leftJoin('hep_hostel_blok', 'hep_hostel_blok.block_id', '=', 'hep_hostel_chkinout.block_id')
    //         ->leftJoin('hep_hostel_room', 'hep_hostel_room.room_id', '=', 'hep_hostel_chkinout.room_id')
    //         ->leftJoin('hep_warden', 'hep_warden.pk_id', '=', 'hep_hostel.hostel_warden')
    //         ->leftJoin('hrm_emp_info', 'hrm_emp_info.emp_id', '=', 'hep_warden.emp_warden')
    //         ->leftJoin('mis_std_info', 'mis_std_info.std_studentid', '=', 'hep_hostel_chkinout.stud_id')
    //         ->where(function ($query) use ($id, $sti_name, $sti_icno) {


    //             if($id != null && $id != '' && $id != 'undefined' && $id != 'null'){
    //                 // dd(1);
    //                 $query->where('hep_hostel_chkinout.stud_id', '=', $id);
    //             }
    //             if($sti_name != null && $sti_name != '' && $sti_name != 'undefined' && $sti_name != 'null'){
    //                 // dd(2);
    //                 $query->where('mis_std_info.sti_name', 'like', '%'.$sti_name.'%');
    //             }
    //             if($sti_icno != null && $sti_icno != '' && $sti_icno != 'undefined' && $sti_icno != 'null'){
    //                 // dd(3);
    //                 $query->where('mis_std_info.sti_icno', '=', $sti_icno);
    //             }
    //             // dd(4);
    //                 // ->orWhere('mis_std_info.sti_name', '=', $sti_name)
    //                 // ->orWhere('mis_std_info.sti_icno', '=', $sti_icno);
    //         })
    //         ->where('hep_hostel_chkinout.recordstatus', '!=', 'DEL')
    //         ->orderBy('hep_hostel_chkinout.checkIn', 'desc')
    //         ->orderBy('hep_hostel_chkinout.checkOut', 'desc')
    //         ->get();
    //         // dd(\DB::getQueryLog());
    // // dd($obj);
    //         if($obj){
    //             return response()->json([
    //                 'success'=>'true',
    //                 'message'=>'List Success!',
    //                 'data'=>$obj
    //             ],200);
    //         }
    //     }






    //report check out 29 sep2023
    public function reportChckOut(Request $request)
    {

        $chkInOutDate = $request->input('chkInOutDate');

        $obj = hep_hostel_checkInOut::where([['hep_hostel_chkinout.recordstatus', '!=', 'DEL'], 
        ['hep_hostel_chkinout.checkIn_status', '=', 'Check Out'],
        ['mis_std_info.recordstatus', '!=', 'DEL']
        ])

        

            ->leftjoin('mis_std_info', 'mis_std_info.std_studentid', '=', 'hep_hostel_chkinout.stud_id')
            ->leftjoin('mis_gender', 'mis_gender.sti_gender_id', '=', 'mis_std_info.sti_gender')
            ->orderBy('checkOut');
        // ->get(
        //     [
        //         'reason', 'sti_gender_name', 'checkOut'
        //     ]
        // );
        if ($chkInOutDate) {
            $dateParts = explode('-', $chkInOutDate);

            // Extract the month and year
            $chkInOutYear = $dateParts[0];
            $chkInOutMonth = $dateParts[1];

            $obj->where(function ($query) use ($chkInOutMonth, $chkInOutYear) {
                $query->whereRaw('YEAR(hep_hostel_chkinout.checkOut) = ' . $chkInOutYear)
                    ->whereRaw('MONTH(hep_hostel_chkinout.checkOut) = ' . $chkInOutMonth);
            });
        }
        $obj = $obj->get(
            ['reason', 'sti_gender_name', 'checkOut']
        );

        // foreach ($obj as $record) {
        //     // Check and set "Others Reason" for null reason
        //     if (is_null($record->reason)) {
        //         $record->reason = "Others Reason";
        //     }

        //     // Check and set "Lain Lain" for null sti_gender_name
        //     if (is_null($record->sti_gender_name)) {
        //         $record->sti_gender_name = "Lain Lain";
        //     }
        // }
        foreach ($obj as $record) {
            // Check and set "Others Reason" for null reason
            if (is_null($record->reason)) {
                $record->reason = "Others Reason";
            }

            // Check and set "Lain Lain" for null sti_gender_name
            if (is_null($record->sti_gender_name)) {
                $record->sti_gender_name = "Lain Lain";
            }
        }


        if ($obj) {
            return response()->json([
                'success' => 'true',
                'message' => 'List Success!',
                'data' => $obj
            ], 200);
        }
    }

    //report check in 29 sep2023
    public function reportChkIn(Request $request)
    {
        $chkInOutDate = $request->input('chkInOutDate');


        // $obj = hep_hostel_checkInOut::where([['hep_hostel_chkinout.recordstatus','!=','DEL']])
        $obj = hep_hostel_checkInOut::where([
            ['hep_hostel_chkinout.recordstatus', '!=', 'DEL'],
            ['hep_hostel_chkinout.checkIn_status', '!=', 'Check Out'],
            ['hep_hostel_chkinout.checkIn_status', '!=', 'Unreside']
        ])
            ->leftjoin('mis_std_info', 'mis_std_info.std_studentid', '=', 'hep_hostel_chkinout.stud_id')
            ->leftjoin('mis_gender', 'mis_gender.sti_gender_id', '=', 'mis_std_info.sti_gender')
            ->orderBy('checkIn_status') // Sort by 'reason' column in ascending order
            ->orderBy('checkIn', 'DESC'); // Sort by 'reason' column in ascending order



        if ($chkInOutDate) {
            $dateParts = explode('-', $chkInOutDate);

            // Extract the month and year
            $chkInOutYear = $dateParts[0];
            $chkInOutMonth = $dateParts[1];

            $obj->where(function ($query) use ($chkInOutMonth, $chkInOutYear) {
                $query->whereRaw('YEAR(hep_hostel_chkinout.checkIn) = ' . $chkInOutYear)
                    ->whereRaw('MONTH(hep_hostel_chkinout.checkIn) = ' . $chkInOutMonth);
            });
        }



        $obj = $obj->get(['sti_gender_name', 'checkIn_status', 'checkIn']);


        $countedData = [];
        foreach ($obj as $record) {
            $sti_gender_name = $record->sti_gender_name ?: "Lain-lain";
            $checkIn_status = $record->checkIn_status ?: "Lain-lain";

            if (!isset($countedData[$sti_gender_name])) {
                $countedData[$sti_gender_name] = [];
            }

            if (!isset($countedData[$sti_gender_name][$checkIn_status])) {
                $countedData[$sti_gender_name][$checkIn_status] = 0;
            }

            $countedData[$sti_gender_name][$checkIn_status]++;
        }

        // Replace empty string key with "Lain-lain" and encode to JSON
        $countedData = str_replace('"":', '"Lain-lain":', json_encode($countedData));


        if ($obj) {
            return response()->json([
                'success' => 'true',
                'message' => 'List Success!',
                'data' => json_decode($countedData, true)
            ], 200);
        } else {
            return response()->json([
                'success' => false,
                'message' => 'List Success!',
                'data' => ''
            ], 401);
        }
    }
    // public function dashboardMainCity(){
    //     $obj = hep_hostel_checkInOut::where([['hep_hostel_chkinout.recordstatus','!=','DEL']])
    //         ->leftjoin('hep_hostel_booking', 'hep_hostel_booking.booking_id','=','hep_hostel_chkinout.fk_booking')
    //         ->leftjoin('mis_prm_college', 'mis_prm_college.pk_id', '=', 'hep_hostel_chkinout.branch_id')
    //         ->leftjoin('hep_hostel', 'hep_hostel.hostel_id', '=', 'hep_hostel_chkinout.hostel_id')
    //         ->leftjoin('hep_hostel_blok', 'hep_hostel_blok.block_id', '=', 'hep_hostel_chkinout.block_id')
    //         ->leftjoin('hep_hostel_room', 'hep_hostel_room.room_id', '=', 'hep_hostel_chkinout.room_id')
    //         ->leftjoin('mis_std_info', 'mis_std_info.std_studentid', '=', 'hep_hostel_chkinout.stud_id')
    //         ->leftjoin('hep_hostel_change', 'hep_hostel_change.change_id','=','hep_hostel_chkinout.fk_hstlChg')
    //         ->where('hep_hostel_chkinout.checkIn_status', '!=', 'Unreside')
    //         ->get([
    //             'clg_name',
    //             'hostel_name',
    //         ]);

    //     if($obj){
    //         $countByClgAndHostel = $obj->countBy(function ($item) {
    //             return $item['clg_name'] . ' - ' . $item['hostel_name'];
    //         });

    //         return response()->json([
    //             'success' => 'true',
    //             'message' => 'List Success!',
    //             'data' => [
    //                 'clg_name_count' => $countByClgAndHostel,
    //             ],
    //         ], 200);
    //     }
    // }
    public function dashboardMainCity()
    {
        $obj =
            // hep_hostel_checkInOut::where([['hep_hostel_chkinout.recordstatus', '!=', 'DEL']])
            //     ->leftjoin('hep_hostel_booking', 'hep_hostel_booking.booking_id', '=', 'hep_hostel_chkinout.fk_booking')
            //     ->leftjoin('mis_prm_college', 'mis_prm_college.pk_id', '=', 'hep_hostel_chkinout.branch_id')
            //     ->leftjoin('hep_hostel', 'hep_hostel.hostel_id', '=', 'hep_hostel_chkinout.hostel_id')
            //     ->leftjoin('hep_hostel_blok', 'hep_hostel_blok.block_id', '=', 'hep_hostel_chkinout.block_id')
            //     ->leftjoin('hep_hostel_room', 'hep_hostel_room.room_id', '=', 'hep_hostel_chkinout.room_id')
            //     ->leftjoin('mis_std_info', 'mis_std_info.std_studentid', '=', 'hep_hostel_chkinout.stud_id')
            //     // ->leftjoin('hep_hostel_change', 'hep_hostel_change.change_id', '=', 'hep_hostel_chkinout.fk_hstlChg')
            //     ->where('hep_hostel_chkinout.checkIn_status', '!=', 'Unreside')
            //     ->select('clg_name', 'hostel_name', 'sti_gender')
            //     ->get();
            // dd($obj);
            hep_hostel_room::select(
                'hep_hostel.hostel_name',
                DB::raw('COUNT(hep_hostel.hostel_name) AS total_rooms'),
                'hep_hostel_room.hostel_id',
                'mis_prm_college.clg_name',
                DB::raw('SUM(hep_hostel_room.total_bed) AS total_bed')
            )
            ->leftJoin('hep_hostel', 'hep_hostel.hostel_id', '=', 'hep_hostel_room.hostel_id')
            ->leftJoin('mis_prm_college', 'mis_prm_college.pk_id', '=', 'hep_hostel.hostel_branch')
            ->leftJoin('hep_hostel_blok', 'hep_hostel_blok.block_id', '=', 'hep_hostel_room.block_id')
            ->where('hep_hostel_room.recordstatus', '!=', 'DEL')
            ->where('hep_hostel_blok.recordstatus', '!=', 'DEL')
            ->where('mis_prm_college.recordstatus', '!=', 'DEL')
            ->where('hep_hostel.recordstatus', '!=', 'DEL')
            ->groupBy(
                'hep_hostel.hostel_name',
                'hep_hostel_room.hostel_id',
                'mis_prm_college.clg_name'
            )
            ->orderBy('hep_hostel.hostel_name', 'ASC')
            ->get();
        // DB::table('hep_hostel_room')
        // ->select(
        //     'hep_hostel.hostel_name',
        //     DB::raw('COUNT(hep_hostel.hostel_name) AS total_rooms'),
        //     'hep_hostel_room.hostel_id',
        //     'hep_hostel.hostel_name',
        //     'mis_prm_college.clg_name',
        //     'total_bed',
        // )
        // ->leftJoin('hep_hostel', 'hep_hostel.hostel_id', '=', 'hep_hostel_room.hostel_id')
        // ->leftJoin('mis_prm_college', 'mis_prm_college.pk_id', '=', 'hep_hostel.hostel_branch')
        // ->leftJoin('hep_hostel_blok', 'hep_hostel_blok.block_id', '=', 'hep_hostel_room.block_id')
        // ->where('hep_hostel_room.recordstatus', '!=', 'DEL')
        // ->where('hep_hostel_blok.recordstatus', '!=', 'DEL')
        // ->where('mis_prm_college.recordstatus', '!=', 'DEL')
        // ->where('hep_hostel.recordstatus', '!=', 'DEL')
        // ->groupBy(
        //     'hep_hostel.hostel_name',
        //     'hep_hostel_room.hostel_id',
        //     'hep_hostel.hostel_name',
        //     'mis_prm_college.clg_name',
        //     'total_bed',

        // )
        // ->orderBy('hostel_name', 'ASC')
        // ->get();
        $result = DB::table('hep_hostel_chkinout')
            ->select([
                // 'hostel_id',
                DB::raw('MAX(branch_id) AS clg_id'),
                DB::raw('MAX(hostel_name) AS hostel_name'),
                DB::raw('MAX(clg_name) AS clg_name'),
                DB::raw('SUM(total_count) AS total_count'),
            ])
            ->fromSub(function ($query) {
                $query->select([
                    'hep_hostel_chkinout.branch_id',
                    'hep_hostel_chkinout.hostel_id',
                    'hep_hostel_chkinout.block_id',
                    'hep_hostel_chkinout.room_id',
                    'hep_hostel.hostel_name',
                    'mis_prm_college.clg_name',
                    DB::raw('COUNT(hep_hostel_chkinout.room_id) AS total_count'),
                ])
                    ->from('hep_hostel_chkinout')
                    ->leftJoin('hep_hostel_room', 'hep_hostel_room.room_id', '=', 'hep_hostel_chkinout.room_id')
                    ->leftJoin('hep_hostel', 'hep_hostel.hostel_id', '=', 'hep_hostel_room.hostel_id')
                    ->leftJoin('mis_prm_college', 'mis_prm_college.pk_id', '=', 'hep_hostel.hostel_branch')
                    ->leftJoin('hep_hostel_blok', 'hep_hostel_blok.block_id', '=', 'hep_hostel_room.block_id')
                    ->where('hep_hostel_room.recordstatus', '!=', 'DEL')
                    ->where('hep_hostel_blok.recordstatus', '!=', 'DEL')
                    ->where('hep_hostel.recordstatus', '!=', 'DEL') //afiez tambah 6february2024
                    ->where('mis_prm_college.recordstatus', '!=', 'DEL')
                    ->where('hep_hostel_chkinout.recordstatus', '!=', 'DEL')
                    ->where(function ($query) {
                        $query->whereNull('hep_hostel_chkinout.checkIn_status')
                            ->orWhere('hep_hostel_chkinout.checkIn_status', '!=', 'Check Out');
                    })
                    ->groupBy('branch_id', 'hep_hostel_chkinout.hostel_id', 'hep_hostel_chkinout.block_id', 'hep_hostel_chkinout.room_id');
            }, 'subquery')
            ->groupBy('hostel_id')
            ->orderBy('hostel_name')
            ->get();
        $groupedResult = $obj->groupBy('clg_name')->map(function ($colleges) {
            return $colleges->mapWithKeys(function ($hostel) {
                return [$hostel->hostel_name => $hostel->total_bed];
            });
        });

        $groupedResult2 = $result->groupBy('clg_name')->map(function ($colleges) {
            return $colleges->mapWithKeys(function ($hostel) {
                return [$hostel->hostel_name => $hostel->total_count];
            });
        });
        // Subtract total_count from total_bed
        $finalResult = $groupedResult->map(function ($beds, $clg_name) use ($groupedResult2) {
            return $beds->mapWithKeys(function ($total_bed, $hostel_name) use ($groupedResult2, $clg_name) {
                $total_count = $groupedResult2->get($clg_name, collect())->get($hostel_name, 0);
                return [$hostel_name => $total_bed - $total_count];
            });
        });
        // dd($finalResult);

        // $genderCounts = $obj->countBy('sti_gender');
        if ($obj) {
            // $groupedData = $obj->groupBy('clg_name')->map(function ($items) {
            //     return $items->groupBy('hostel_name')->map->count();
            // });

            return response()->json([
                'success' => 'true',
                'message' => 'List Success!',
                'data' => $groupedResult,
                'data1' => $groupedResult2,
                'data2' => $finalResult,
            ], 200);
        }
    }


    // public function dashboardOccupied()
    // {
    //     $obj=hep_hostel_checkInOut::leftJoin('hep_hostel_blok', 'hep_hostel_blok.block_id', '=', 'hep_hostel_chkinout.block_id')
    //         ->where('hep_hostel_chkinout.recordstatus', '!=', 'DEL')
    //         ->where(function ($query) {
    //             $query->where('hep_hostel_chkinout.checkIn_status', 'Check In')
    //                 ->orWhere('hep_hostel_chkinout.checkIn_status', 'New');
    //         })
    //         ->get(['block_gender']);

    //     // = hep_hostel_checkInOut::where([['hep_hostel_chkinout.recordstatus', '!=', 'DEL']])
    //     //     ->leftjoin('hep_hostel_booking', 'hep_hostel_booking.booking_id', '=', 'hep_hostel_chkinout.fk_booking')
    //     //     ->leftjoin('mis_prm_college', 'mis_prm_college.pk_id', '=', 'hep_hostel_chkinout.branch_id')
    //     //     ->leftjoin('hep_hostel', 'hep_hostel.hostel_id', '=', 'hep_hostel_chkinout.hostel_id')
    //     //     ->leftjoin('hep_hostel_blok', 'hep_hostel_blok.block_id', '=', 'hep_hostel_chkinout.block_id')
    //     //     ->leftjoin('hep_hostel_room', 'hep_hostel_room.room_id', '=', 'hep_hostel_chkinout.room_id')
    //     //     ->leftjoin('mis_std_info', 'mis_std_info.std_studentid', '=', 'hep_hostel_chkinout.stud_id')
    //     //     // ->leftjoin('hep_hostel_change', 'hep_hostel_change.change_id', '=', 'hep_hostel_chkinout.fk_hstlChg')
    //     //     ->where('hep_hostel_chkinout.checkIn_status', '!=', 'Unreside')
    //     //     ->select('clg_name', 'hostel_name','sti_gender')
    //     //     ->get();
    //         $genderCounts = $obj->countBy('sti_gender');
    //         if ($obj) {
    //         // $groupedData = $obj->groupBy('clg_name')->map(function ($items) {
    //         //     return $items->groupBy('hostel_name')->map->count();
    //         // });

    //         $genderCounts = $obj->countBy('block_gender');

    //         return response()->json([
    //             'success' => 'true',
    //             'message' => 'List Success!',
    //             'data' => $genderCounts,
    //         ], 200);
    //     }
    // }






    public function dashboardOccupied(request $request)
    {
        // $haha=;
        $MonthYearpick = $request->input('MonthYearpick');

        $str = explode("-", $MonthYearpick);
        // index 0 = tahun
        // index 1 = bulan
        // dd($str[0]);7

        // $monthPick = explode(" ",$str)
        // $yrPick = $request->input('yrPickDashboard');

        $obj = hep_hostel_checkInOut::leftJoin('hep_hostel_blok', 'hep_hostel_blok.block_id', '=', 'hep_hostel_chkinout.block_id')
            ->where('hep_hostel_chkinout.recordstatus', '!=', 'DEL')
            ->where(function ($query) {
                $query->where('hep_hostel_chkinout.checkIn_status', 'Check In')
                    ->orWhere('hep_hostel_chkinout.checkIn_status', 'New');
            });
        // if (!empty($str) && count($str) == 2) {
        //     // If $str[0] (year) and $str[1] (month) are provided, filter by them
        //     $obj = $obj->whereYear('checkIn', '=', $str[0])
        //         ->whereMonth('checkIn', '=', $str[1]);
        // }
        if (!empty($str) && count($str) == 2) {
            $year = $str[0];
            $month = $str[1];

            // If $str[0] (year) and $str[1] (month) are provided, filter by them
            $obj = $obj->where(function ($query) use ($year, $month) {
                $query->whereYear('checkIn', '<', $year)
                    ->orWhere(function ($query) use ($year, $month) {
                        $query->whereYear('checkIn', '=', $year)
                            ->whereMonth('checkIn', '<=', $month);
                    });
            });
        }

        // Retrieve the records
        $records = $obj->get();
        $genderCounts = $records->countBy('block_gender');

        if ($obj) {

            return response()->json([
                'success' => true,
                'message' => 'List Success!',
                'data' => $genderCounts,
            ], 200);
        } else {
            return response()->json([
                'success' => false,
                'message' => 'List Not Success!',
                'data' => 'No Data',
            ], 200);
        }
    }


    public function ListAssignedAKANewCheckIN(Request $request)
    {
        //afiez 01 november 2023
        $chkInOutDate = $request->input('chkInOutDate');
        $FK_status_Student = $request->input('FK_status_Student');

        $obj = hep_hostel_checkInOut::where([['hep_hostel_chkinout.recordstatus', '!=', 'DEL']])
            ->leftjoin('hep_hostel_booking', 'hep_hostel_booking.booking_id', '=', 'hep_hostel_chkinout.fk_booking')
            ->leftjoin('mis_prm_college', 'mis_prm_college.pk_id', '=', 'hep_hostel_chkinout.branch_id')
            ->leftjoin('hep_hostel', 'hep_hostel.hostel_id', '=', 'hep_hostel_chkinout.hostel_id')
            ->leftjoin('hep_hostel_blok', 'hep_hostel_blok.block_id', '=', 'hep_hostel_chkinout.block_id')
            ->leftjoin('hep_hostel_room', 'hep_hostel_room.room_id', '=', 'hep_hostel_chkinout.room_id')
            ->leftjoin('mis_std_info', 'mis_std_info.std_studentid', '=', 'hep_hostel_chkinout.stud_id')
            ->leftjoin('mis_status', 'mis_status.sts_status_id', '=', 'mis_std_info.status_academic')
            ->where('hep_hostel_chkinout.checkIn_status', '=', 'New');






        if ($chkInOutDate) {
            $dateParts = explode('-', $chkInOutDate);

            // Extract the month and year
            $chkInOutYear = $dateParts[0];
            $chkInOutMonth = $dateParts[1];

            $obj->where(function ($query) use ($chkInOutMonth, $chkInOutYear) {
                $query->whereRaw('YEAR(hep_hostel_chkinout.checkIn) = ' . $chkInOutYear)
                    ->whereRaw('MONTH(hep_hostel_chkinout.checkIn) = ' . $chkInOutMonth);
            });
        }


        if ($FK_status_Student) {
            $obj->where('mis_std_info.status_academic', $FK_status_Student);
        }


        $obj =   $obj->get([
            'chkInOut_id',
            'clg_name',
            'hostel_name',
            'block_name',
            'room_no',
            'hep_hostel_chkinout.stud_id AS std_id',
            'sti_name',
            'checkIn',
            'checkOut',
            'checkIn_status',
            'checkOut_status',
            'expected_chkInDate',
            'notify_warden',

            'mis_status.sts_status_name_en',

        ]);

        if ($obj) {
            return response()->json([
                'success' => 'true',
                'message' => 'List Success!',
                'data' => $obj
            ], 200);
        }
    }


    public function StudentGrad(Request $request)
    {
        //afiez 01 november 2023
        $stud_id = $request->input('stud_id');
        //    $sti_name = $request->input('chkInOut_name');
        //    $sti_icno = $request->input('chkInOut_ic');

        $obj = hep_hostel_checkInOut::where([
            ['hep_hostel_chkinout.recordstatus', '!=', 'DEL'],
            ['hep_hostel_chkinout.stud_id', '=',  $stud_id]
        ])
            ->latest('chkInOut_id')
            ->update([

                // 'stud_id' =>  $stud_id,
                'checkOut' => date("Y-m-d"),
                'checkOut_status' => 'Accept',
                'checkIn_status' => 'Check Out',
                'recordstatus' => 'EDT',
            ]);

        // $objUpdate = $obj

        if ($obj) {
            return response()->json([
                'success' => 'true',
                'message' => 'List Success!',
                'data' => $obj
            ], 200);
        }
    }


    public function reportingChkInOut(Request $request)
    {
        //afiez 01 november 2023
        //afiez 01 november 2023

        $chkInOutDate = $request->input('chkInOutDate');

        // $chkInOutMonth = $request->input('chkInOutMonth');
        // $chkInOutYear = $request->input('chkInOutYear');
        $FK_status_Student = $request->input('FK_status_Student');
        $ChkInOutSelect = $request->input('ChkInOutSelect');

        $obj = hep_hostel_checkInOut::select([
            'hep_hostel_chkinout.chkInOut_id',
            'hep_hostel_chkinout.stud_id',
            'hep_hostel_chkinout.checkIn',
            'hep_hostel_chkinout.checkOut',
            'hep_hostel_chkinout.checkIn_status',
            'hep_hostel_chkinout.checkOut_status',
            'hep_hostel_chkinout.reason',
            'hep_hostel_chkinout.recordstatus',

            'mis_std_info.sti_name',
            'mis_std_info.sti_icno',
            'mis_std_info.status_academic as FK_status_Student',
            'mis_std_info.sti_gender',
            'mis_std_info.sti_contactno_mobile',

            'mis_status.sts_status_name_en',

            // name hostel detail
            'clg_name',
            'hostel_name',
            'block_name',
            'room_no',
        ])
            ->where([['hep_hostel_chkinout.recordstatus', '!=', 'DEL']])
            ->leftjoin('mis_std_info', 'mis_std_info.std_studentid', '=', 'hep_hostel_chkinout.stud_id')
            ->leftjoin('mis_status', 'mis_status.sts_status_id', '=', 'mis_std_info.status_academic')

            ->leftjoin('mis_prm_college', 'mis_prm_college.pk_id', '=', 'hep_hostel_chkinout.branch_id')
            ->leftjoin('hep_hostel', 'hep_hostel.hostel_id', '=', 'hep_hostel_chkinout.hostel_id')
            ->leftjoin('hep_hostel_blok', 'hep_hostel_blok.block_id', '=', 'hep_hostel_chkinout.block_id')
            ->leftjoin('hep_hostel_room', 'hep_hostel_room.room_id', '=', 'hep_hostel_chkinout.room_id')

            ->orderBy('chkInOut_id', 'ASC');

        if ($chkInOutDate == null && $FK_status_Student == null && $ChkInOutSelect == null) {
            $obj->whereYear('hep_hostel_chkinout.checkIn', '=', date("Y"));
        }

        if ($chkInOutDate) {
            $dateParts = explode('-', $chkInOutDate);

            // Extract the month and year
            $chkInOutYear = $dateParts[0];
            $chkInOutMonth = $dateParts[1];

            $obj->where(function ($query) use ($chkInOutMonth, $chkInOutYear) {
                $query->whereRaw('YEAR(hep_hostel_chkinout.checkIn) = ' . $chkInOutYear)
                    ->whereRaw('MONTH(hep_hostel_chkinout.checkIn) = ' . $chkInOutMonth);
            });
        }
        if ($FK_status_Student) {
            $obj->where('mis_std_info.status_academic', $FK_status_Student);
        }

        if ($ChkInOutSelect) {
            if ($ChkInOutSelect == 'out') {
                $obj->where('hep_hostel_chkinout.checkIn_status', 'Check Out');
            } elseif ($ChkInOutSelect == 'in') {
                $obj->where(function ($query) {
                    $query
                        // ->where('hep_hostel_chkinout.checkIn_status', 'New')
                        ->Where('hep_hostel_chkinout.checkIn_status', 'Check In');


                    // $query->where('hep_hostel_chkinout.checkIn_status', 'New')
                    // ->orWhere('hep_hostel_chkinout.checkIn_status', 'Check In');
                });
            } elseif ($ChkInOutSelect == 'new') {
                $obj->where(function ($query) {
                    // $query
                    // // ->where('hep_hostel_chkinout.checkIn_status', 'New')
                    //     ->Where('hep_hostel_chkinout.checkIn_status', 'Check In');


                    $query->where('hep_hostel_chkinout.checkIn_status', 'New')
                        // ->orWhere('hep_hostel_chkinout.checkIn_status', 'Check In')
                    ;
                });
            }
        }
        // dd( date("Y")  );




        $obj_Reporting = $obj->get();
        if ($obj) {
            return response()->json([
                'success' => 'true',
                'message' => 'List Success!',
                'data' => $obj_Reporting
            ], 200);
        }
    }


    public function chkSttsInAndNEw($id)
    {
        $obj = hep_hostel_checkInOut::where([
            ['stud_id', '=', $id],
            ['checkIn_status', '=', 'New'],
            ['recordstatus', '!=', 'DEL']
        ])
            ->orWhere([
                ['stud_id', '=', $id],
                ['checkIn_status', '=', 'Check In'],
                ['recordstatus', '!=', 'DEL']
            ])
            ->orWhere([
                ['stud_id', '=', $id],
                ['checkIn_status', '=', 'Check Out'],
                ['checkOut_status', '!=', 'Accept'],
                ['recordstatus', '!=', 'DEL']
            ])
            // ->first(['chkInOut_id']);
            ->first(
                [
                    'chkInOut_id',
                    'checkOut_status',
                    'checkIn_status',
                    'recordstatus',
                ],
            );


        if ($obj) {
            // Record found, check the conditions and send appropriate messages
            if ($obj->checkIn_status == 'New') {
                return response()->json([
                    'success' => true,
                    'message' => 'Student already Check In',
                    'data' => $obj
                ], 200);
            } elseif ($obj->checkIn_status == 'Check In') {
                return response()->json([
                    'success' => true,
                    'message' => 'Student already Check In',
                    'data' => $obj
                ],  200);
            } elseif ($obj->checkIn_status == 'Check Out' && $obj->checkOut_status != 'Accept') {
                return response()->json([
                    'success' => true,
                    'message' => 'Student already Checkout but admin not accept',
                    'data' => $obj
                ],  200);
            }
        } else {
            // if ($obj) {
            //     return response()->json([
            //         'success' => true,
            //         'message' => 'List Success!',
            //         'data' => $obj
            //     ], 200);
            // } else {
            return response()->json([
                'success' => false,
                'message' => "Update Failed!",
                'data' => ''
            ], 404);
        }
    }


    public function chkLatestRoom($id)
    {


        $obj = hep_hostel_checkInOut::select([
            'hep_hostel_chkinout.chkInOut_id',
            'hep_hostel_chkinout.stud_id',
            'hep_hostel_chkinout.checkIn',
            'hep_hostel_chkinout.checkOut',
            'hep_hostel_chkinout.checkIn_status',
            'hep_hostel_chkinout.checkOut_status',
            'hep_hostel_chkinout.reason',
            'hep_hostel_chkinout.recordstatus',
            'hep_hostel_chkinout.lastapproveon',

            'mis_std_info.sti_name',
            'mis_std_info.sti_icno',
            'mis_std_info.status_academic as FK_status_Student',
            'mis_std_info.sti_gender',
            'mis_std_info.sti_contactno_mobile',

            'mis_status.sts_status_name_en',

            // name hostel detail
            'clg_name',
            'hostel_name',
            'block_name',
            'room_no',

            'hep_hostel_chkinout.branch_id',
            'hep_hostel_chkinout.hostel_id',
            'hep_hostel_chkinout.block_id',
            'hep_hostel_chkinout.room_id'
        ])
            ->where([
                ['hep_hostel_chkinout.stud_id', '=', $id],
                // ['hep_hostel_chkinout.recordstatus', '!=', 'DEL']
            ])
            ->leftjoin('mis_std_info', 'mis_std_info.std_studentid', '=', 'hep_hostel_chkinout.stud_id')
            ->leftjoin('mis_status', 'mis_status.sts_status_id', '=', 'mis_std_info.status_academic')

            ->leftjoin('mis_prm_college', 'mis_prm_college.pk_id', '=', 'hep_hostel_chkinout.branch_id')
            ->leftjoin('hep_hostel', 'hep_hostel.hostel_id', '=', 'hep_hostel_chkinout.hostel_id')
            ->leftjoin('hep_hostel_blok', 'hep_hostel_blok.block_id', '=', 'hep_hostel_chkinout.block_id')
            ->leftjoin('hep_hostel_room', 'hep_hostel_room.room_id', '=', 'hep_hostel_chkinout.room_id')

            ->latest()
            ->first();

        if ($obj) {
            return response()->json([
                'success' => 'true',
                'message' => 'List Success!',
                'data' => $obj
            ], 200);
        }
    }

    public function reportBaitulMal(Request $request)
    {

        $month = $request->input('month');
        $year = $request->input('year');
        $asnaf_cat = $request->input('asnaf');
        $baitulMal_cat = $request->input('baitulMal');

        $obj = DB::table('hep_hostel_chkinout')
            ->leftJoin('mis_std_info', 'hep_hostel_chkinout.stud_id', '=', 'mis_std_info.std_studentid')
            ->leftJoin('mis_prm_college', 'hep_hostel_chkinout.branch_id', '=', 'mis_prm_college.pk_id')
            ->leftJoin('hep_hostel', 'hep_hostel_chkinout.hostel_id', '=', 'hep_hostel.hostel_id')
            ->leftJoin('hep_hostel_blok', 'hep_hostel_chkinout.block_id', '=', 'hep_hostel_blok.block_id')
            ->leftJoin('hep_hostel_room', 'hep_hostel_chkinout.room_id', '=', 'hep_hostel_room.room_id')
            ->leftJoin('hep_hostel_booking', 'hep_hostel_booking.booking_id', '=', 'hep_hostel_chkinout.fk_booking')
            ->select(
                'hep_hostel_chkinout.stud_id',
                'mis_std_info.sti_name',
                'mis_std_info.sti_icno',
                'hep_hostel.hostel_name',
                'mis_prm_college.clg_name',
                'hep_hostel_blok.block_name',
                'hep_hostel_room.room_no',
                'hep_hostel_chkinout.checkIn',
                'hep_hostel_chkinout.checkIn_status',
                'hep_hostel_chkinout.checkOut',
                'hep_hostel_chkinout.checkOut_status',
                'hep_hostel_chkinout.type',
                'hep_hostel_chkinout.fk_booking AS fk_booking'
            )
            ->where(function ($query) {
                $query->where('hep_hostel_chkinout.checkIn_status', '=', 'Check In')
                    ->orWhere('hep_hostel_chkinout.checkIn_status', '=', 'New')
                    ->orWhere('hep_hostel_chkinout.checkIn_status', '=', 'Check Out');
            })
            ->where('hep_hostel_chkinout.recordstatus', '!=', 'DEL')
            ->where(function ($query) {
                $query->whereNull('hep_hostel_chkinout.reason')
                    ->orWhere('hep_hostel_chkinout.reason', '!=', 'Not Reside Hostel');
            });

            if (!$month && !$year && !$asnaf_cat && !$baitulMal_cat){
                // $currentMonth = date('n');
                $currentYear = date('Y');
                $firstDayOfYear = "$currentYear-01-01";
                $lastDayOfYear = "$currentYear-12-31";

                $obj = $obj->whereBetween('checkIn', [$firstDayOfYear, $lastDayOfYear]);
                $obj = $obj->limit(100);

            }
            $obj = $obj->orderBy('mis_prm_college.clg_name')
            ->orderBy('hep_hostel.hostel_name')
            ->orderBy('hep_hostel_blok.block_name')
            ->orderBy('hep_hostel_room.room_no');

        if ($baitulMal_cat) {
            $obj = $obj->where('mis_std_info.sti_baitulmal', '=', $baitulMal_cat);
        }

        if ($asnaf_cat) {
            $obj = $obj->where('mis_std_info.sti_asnaf', '=', $asnaf_cat);
        }

        if ($month) {
            $currentMonth = date('n');
            $currentYear = date('Y');
            $firstDayOfMonth = "$year-$month-01";
            $lastDayOfMonth = date('Y-m-t', strtotime($firstDayOfMonth));

            if ($month == $currentMonth && $year == $currentYear) {
                // If it's the current month, filter by checkIn month greater than or equal to $month and checkOut is null
                $obj = $obj->where(function ($query) use ($month, $year) {
                    $query->whereYear('checkIn', '=', $year)
                        ->whereMonth('checkIn', '<=', $month)
                        ->whereNull('checkOut');
                });
            } else {
                $obj = $obj->whereBetween('checkIn', [$firstDayOfMonth, $lastDayOfMonth]);
            }
        }

        $obj = $obj->get();

        if ($obj) {
            return response()->json([
                'success' => 'true',
                'message' => 'List Success!',
                'data' => $obj
            ], 200);
        }
    }

    public function reportBaitulMal2(Request $request)
    {

        $month = $request->input('month');
        $year = $request->input('year');
        $asnaf_cat = $request->input('asnaf');
        $baitulMal_cat = $request->input('baitulMal');


        $obj = DB::table('hep_hostel_chkinout')
            ->leftJoin('mis_std_info', 'hep_hostel_chkinout.stud_id', '=', 'mis_std_info.std_studentid')
            ->leftJoin('mis_prm_college', 'hep_hostel_chkinout.branch_id', '=', 'mis_prm_college.pk_id')
            ->leftJoin('hep_hostel', 'hep_hostel_chkinout.hostel_id', '=', 'hep_hostel.hostel_id')
            ->leftJoin('hep_hostel_blok', 'hep_hostel_chkinout.block_id', '=', 'hep_hostel_blok.block_id')
            ->leftJoin('hep_hostel_room', 'hep_hostel_chkinout.room_id', '=', 'hep_hostel_room.room_id')
            ->leftJoin('hep_hostel_booking', 'hep_hostel_booking.booking_id', '=', 'hep_hostel_chkinout.fk_booking')
            ->select(
                'hep_hostel_chkinout.stud_id',
                'mis_std_info.sti_name',
                'mis_std_info.sti_icno',
                'hep_hostel.hostel_name',
                'mis_prm_college.clg_name',
                'hep_hostel_blok.block_name',
                'hep_hostel_room.room_no',
                'hep_hostel_chkinout.checkIn',
                'hep_hostel_chkinout.checkIn_status',
                'hep_hostel_chkinout.checkOut',
                'hep_hostel_chkinout.checkOut_status',
                'hep_hostel_chkinout.type',
                'hep_hostel_chkinout.fk_booking AS fk_booking'
            )
            ->where(function ($query) {
                $query->where('hep_hostel_chkinout.checkIn_status', '=', 'Check In')
                    ->orWhere('hep_hostel_chkinout.checkIn_status', '=', 'New')
                    ->orWhere('hep_hostel_chkinout.checkIn_status', '=', 'Check Out');
            })
            // ->where('hep_hostel_chkinout.stud_id', '=', 'BPT12220002')
            ->where('hep_hostel_chkinout.recordstatus', '!=', 'DEL');

        if ($baitulMal_cat) {
            $obj = $obj->where('mis_std_info.sti_baitulmal', '=', $baitulMal_cat);
        }

        if ($asnaf_cat) {
            $obj = $obj->where('mis_std_info.sti_asnaf', '=', $asnaf_cat);
        }

        // if ($month){
        //     $obj = $obj ->whereMonth('hep_hostel_chkinout.checkIn', '=', $month);
        // }

        // if ($year){
        //     $obj = $obj ->whereYear('hep_hostel_chkinout.checkIn', '=', $year);
        // }
        if ($month) {
            $currentMonth = date('n');
            $currentYear = date('Y');
            $firstDayOfMonth = "$year-$month-01";
            $lastDayOfMonth = date('Y-m-t', strtotime($firstDayOfMonth));
            $currentDate = Carbon::today()->toDateString();

            if ($month == $currentMonth && $year == $currentYear) {
                // If it's the current month, filter by checkIn month greater than or equal to $month and checkOut is null
                $obj = $obj->where(function ($query) use ($month, $year, $currentDate) {
                    $query
                    // ->whereYear('checkIn', '=', $year)
                        // ->whereMonth('checkIn', '<=', $month)
                        ->where('checkIn', '<=', $currentDate)
                        ->whereNull('checkOut');
                });
                $obj = $obj->get();
            } else {


                // // If it's not the current month, apply the three conditions
                // $obj = $obj->where(function($query) use ($month, $year, $firstDayOfMonth, $lastDayOfMonth) {
                //     $query->where(function($subQuery) use ($month, $year, $lastDayOfMonth) {
                //                // Condition 1: checkOut is less than or equal to the end of the month
                //                $subQuery->where('checkOut', '<=', $lastDayOfMonth)
                //                         ->whereMonth('checkOut', '=', $month)
                //                         ->whereYear('checkOut', '=', $year);
                //            })
                //            ->orWhere(function($subQuery) use ($month, $year, $firstDayOfMonth, $lastDayOfMonth) {
                //                // Condition 2: checkIn is greater than or equal to the start of the month and checkOut is less than or equal to the end of the month
                //                $subQuery->where('checkIn', '>=', $firstDayOfMonth)
                //                         ->where('checkOut', '<=', $lastDayOfMonth)
                //                         ->whereMonth('checkOut', '=', $month)
                //                         ->whereYear('checkOut', '=', $year);
                //            })
                //            ->orWhere(function($subQuery) use ($month, $year, $lastDayOfMonth) {
                //                // Condition 3: checkOut is null or empty and checkIn is less than or equal to the end of the month
                //                $subQuery->where(function($innerQuery) {
                //                    $innerQuery->whereNull('checkOut')
                //                               ->orWhere('checkOut', '');
                //                })
                //                ->where('checkIn', '>=', $lastDayOfMonth);
                //            });
                // });
                $obj = $obj->get();
            }
        } else {
            // dd('s');
            $obj = $obj->get();
        }

        // $obj = $obj->get();

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

    public function reportUnreside(Request $request)
    {

        $month = $request->input('month');
        $year = $request->input('year');


        $obj = DB::table('hep_hostel_chkinout')
            ->select('hep_hostel_chkinout.stud_id', 'mis_std_info.sti_name', 'mis_std_info.sti_icno', 'hep_hostel_chkinout.checkIn_status', 'hep_hostel_chkinout.reason')
            ->leftJoin('mis_std_info', 'hep_hostel_chkinout.stud_id', '=', 'mis_std_info.std_studentid')
            ->where('hep_hostel_chkinout.checkIn_status', 'Unreside')
            ->where('hep_hostel_chkinout.recordstatus', '!=', 'DEL');

        if ($month) {
            $obj = $obj->whereMonth('hep_hostel_chkinout.lastupdateon', '=', $month);
        }

        if ($year) {
            $obj = $obj->whereYear('hep_hostel_chkinout.lastupdateon', '=', $year);
        }


        $obj = $obj->get();

        // $records now contains the result of the query

        if ($obj) {
            return response()->json([
                'success' => 'true',
                'message' => 'List Success!',
                'data' => $obj
            ], 200);
        }
    }

    public function reportCheckOut(Request $request)
    {

        $month = $request->input('month');
        $year = $request->input('year');


        $obj = DB::table('hep_hostel_chkinout')
            ->select('hep_hostel_chkinout.stud_id', 'mis_std_info.sti_name', 'mis_std_info.sti_icno', 'hep_hostel_chkinout.checkIn_status', 'hep_hostel_chkinout.reason')
            ->leftJoin('mis_std_info', 'hep_hostel_chkinout.stud_id', '=', 'mis_std_info.std_studentid')
            ->where('hep_hostel_chkinout.checkIn_status', 'Check Out')
            ->where('hep_hostel_chkinout.recordstatus', '!=', 'DEL')
            ->where('mis_std_info.recordstatus', '!=', 'DEL')
            ->whereMonth('hep_hostel_chkinout.checkOut', '=', $month)
            ->whereYear('hep_hostel_chkinout.checkOut', '=', $year)
            ->get();

        // $records now contains the result of the query



        if ($obj) {
            return response()->json([
                'success' => 'true',
                'message' => 'List Success!',
                'data' => $obj
            ], 200);
        }
    }

    public function reportCheckIn(Request $request)
    {

        $month = $request->input('month');
        $year = $request->input('year');


        $obj = DB::table('hep_hostel_chkinout')
            ->select('hep_hostel_chkinout.stud_id', 'mis_std_info.sti_name', 'mis_std_info.sti_icno', 'hep_hostel_chkinout.checkIn_status', 'hep_hostel_chkinout.reason')
            ->leftJoin('mis_std_info', 'hep_hostel_chkinout.stud_id', '=', 'mis_std_info.std_studentid')
            ->where('hep_hostel_chkinout.checkIn_status', 'Check In')
            ->where('hep_hostel_chkinout.recordstatus', '!=', 'DEL')
            ->where('mis_std_info.recordstatus', '!=', 'DEL')
            ->whereMonth('hep_hostel_chkinout.checkIn', '=', $month)
            ->whereYear('hep_hostel_chkinout.checkIn', '=', $year)
            ->get();

        // $records now contains the result of the query



        if ($obj) {
            return response()->json([
                'success' => 'true',
                'message' => 'List Success!',
                'data' => $obj
            ], 200);
        }
    }


    public function reportSummary()
    {

        // $obj = DB::table(DB::raw("(SELECT
        //         hep_hostel_chkinout.hostel_id,
        //         hep_hostel.hostel_name,
        //         hep_hostel_blok.block_gender,
        //         hep_hostel_chkinout.room_id, 
        //         hep_hostel_room.total_bed,
        //         COUNT(CASE WHEN mis_std_info.sti_gender = 'P' THEN 1 END) AS female_count,
        //         COUNT(CASE WHEN mis_std_info.sti_gender = 'L' THEN 1 END) AS male_count
        //     FROM
        //         hep_hostel_chkinout
        //         LEFT JOIN mis_std_info ON hep_hostel_chkinout.stud_id = mis_std_info.std_studentid
        //         LEFT JOIN mis_prm_college ON hep_hostel_chkinout.branch_id = mis_prm_college.pk_id
        //         LEFT JOIN hep_hostel ON hep_hostel_chkinout.hostel_id = hep_hostel.hostel_id
        //         LEFT JOIN hep_hostel_blok ON hep_hostel_chkinout.block_id = hep_hostel_blok.block_id
        //         LEFT JOIN hep_hostel_room ON hep_hostel_chkinout.room_id = hep_hostel_room.room_id 
        //     WHERE
        //         (hep_hostel_chkinout.checkIn_status = 'Check In' OR hep_hostel_chkinout.checkIn_status = 'New') 
        //         AND hep_hostel_chkinout.recordstatus != 'DEL' 
        //         AND hep_hostel_room.recordstatus != 'DEL' 
        //         AND hep_hostel.recordstatus != 'DEL' 
        //         AND hep_hostel_blok.recordstatus != 'DEL' 
        //     GROUP BY
        //         hep_hostel_chkinout.hostel_id,
        //         hep_hostel.hostel_name,
        //         hep_hostel_blok.block_gender,
        //         hep_hostel_chkinout.room_id,
        //         hep_hostel_room.total_bed) AS t"))
        //     ->select(
        //         't.hostel_name',
        //         DB::raw('SUM(t.total_bed) as tbed'),
        //         DB::raw('SUM(CASE WHEN t.block_gender = "Male" THEN t.total_bed END) as tbedL'),
        //         DB::raw('SUM(CASE WHEN t.block_gender = "Female" THEN t.total_bed END) AS tbedP'),
        //         DB::raw('SUM(t.male_count) AS tOccbedL'),
        //         DB::raw('SUM(t.female_count) AS tOccbedP'),
        //         DB::raw('(SUM(t.male_count) + SUM(t.female_count)) as tOccbed'),
        //         DB::raw('(SUM(CASE WHEN t.block_gender = "Male" THEN t.total_bed END)-SUM(t.male_count)) as tUnOccbedL'),
        //         DB::raw('(SUM(CASE WHEN t.block_gender = "Female" THEN t.total_bed END)-SUM(t.female_count)) as tUnOccbedP'),
        //         DB::raw('(SUM(t.total_bed) - (SUM(t.male_count) + SUM(t.female_count))) as tUnOccbed')
        //     )
        //     ->groupBy('t.hostel_id', 't.hostel_name')
        //     ->orderBy('t.hostel_name', 'ASC')
        //     ->get();

        $obj = DB::table(function ($query) {
            $query->select(
                'hep_hostel.hostel_id',
                'hep_hostel.hostel_name',
                DB::raw('SUM(hep_hostel_room.total_bed) AS tbed'),
                DB::raw('SUM(CASE WHEN hep_hostel_blok.block_gender = "Male" THEN hep_hostel_room.total_bed ELSE 0 END) AS tbedL'),
                DB::raw('SUM(CASE WHEN hep_hostel_blok.block_gender = "Female" THEN hep_hostel_room.total_bed ELSE 0 END) AS tbedP')
            )
                ->from('hep_hostel')
                ->leftJoin('hep_hostel_room', 'hep_hostel.hostel_id', '=', 'hep_hostel_room.hostel_id')
                ->leftJoin('hep_hostel_blok', 'hep_hostel_room.block_id', '=', 'hep_hostel_blok.block_id')
                ->where('hep_hostel.recordstatus', '!=', 'DEL')
                ->where('hep_hostel_room.recordstatus', '!=', 'DEL')
                ->where('hep_hostel_blok.recordstatus', '!=', 'DEL')
                ->groupBy('hep_hostel.hostel_id', 'hep_hostel.hostel_name');
        }, 't2')
            ->leftJoin(DB::raw('(
            SELECT
                hep_hostel.hostel_id,
                hep_hostel.hostel_name,
                hep_hostel_blok.block_gender,
                hep_hostel_room.room_id,
                COALESCE(hep_hostel_room.total_bed, 0) AS total_bed,
                COUNT(CASE WHEN mis_std_info.sti_gender = "P" THEN 1 END) AS female_count,
                COUNT(CASE WHEN mis_std_info.sti_gender = "L" THEN 1 END) AS male_count
            FROM
                hep_hostel
            LEFT JOIN hep_hostel_chkinout ON hep_hostel.hostel_id = hep_hostel_chkinout.hostel_id
                AND hep_hostel_chkinout.checkIn_status IN ("Check In", "New")
                AND hep_hostel_chkinout.recordstatus != "DEL"
            LEFT JOIN mis_std_info ON hep_hostel_chkinout.stud_id = mis_std_info.std_studentid
            LEFT JOIN mis_prm_college ON hep_hostel_chkinout.branch_id = mis_prm_college.pk_id
            LEFT JOIN hep_hostel_blok ON hep_hostel_chkinout.block_id = hep_hostel_blok.block_id
                AND hep_hostel_blok.recordstatus != "DEL"
            LEFT JOIN hep_hostel_room ON hep_hostel_chkinout.room_id = hep_hostel_room.room_id
                AND hep_hostel_room.recordstatus != "DEL"
            WHERE
                hep_hostel.recordstatus != "DEL"
            GROUP BY
                hep_hostel.hostel_id,
                hep_hostel.hostel_name,
                hep_hostel_blok.block_gender,
                hep_hostel_room.room_id,
                hep_hostel_room.total_bed
        ) AS t'), 't.hostel_id', '=', 't2.hostel_id')
            ->select(
                't.hostel_id',
                't.hostel_name',
                't2.tbed',
                't2.tbedL',
                't2.tbedP',
                DB::raw('SUM(COALESCE(t.male_count, 0)) AS tOccbedL'),
                DB::raw('SUM(COALESCE(t.female_count, 0)) AS tOccbedP'),
                DB::raw('(SUM(COALESCE(t.male_count, 0)) + SUM(COALESCE(t.female_count, 0))) AS tOccbed'),
                DB::raw('(t2.tbedL - SUM(COALESCE(t.male_count, 0))) AS tUnOccbedL'),
                DB::raw('(t2.tbedP - SUM(COALESCE(t.female_count, 0))) AS tUnOccbedP'),
                DB::raw('((t2.tbedL - SUM(COALESCE(t.male_count, 0))) + (t2.tbedP - SUM(COALESCE(t.female_count, 0)))) AS tUnOccbed')
            )
            ->groupBy('t.hostel_id', 't.hostel_name', 't2.tbed', 't2.tbedL', 't2.tbedP')
            ->orderBy('t.hostel_name', 'ASC')
            ->get();




        if ($obj) {
            return response()->json([
                'success' => 'true',
                'message' => 'List Success!',
                'data' => $obj
            ], 200);
        }
    }



    public function checkBookinngList($fk_booking)
    {


        $obj = hep_hostel_checkInOut::where([
            ['hep_hostel_chkinout.fk_booking', $fk_booking],
            ['hep_hostel_chkinout.recordstatus', '!=', 'DEL']
        ])

            ->leftjoin('mis_prm_college', 'mis_prm_college.pk_id', '=', 'hep_hostel_chkinout.branch_id')
            ->leftjoin('hep_hostel', 'hep_hostel.hostel_id', '=', 'hep_hostel_chkinout.hostel_id')
            ->leftjoin('hep_hostel_blok', 'hep_hostel_blok.block_id', '=', 'hep_hostel_chkinout.block_id')
            ->leftjoin('hep_hostel_room', 'hep_hostel_room.room_id', '=', 'hep_hostel_chkinout.room_id')

            ->first(
                [
                    'chkInOut_id',
                    'fk_booking',
                    'type',
                    'stud_id',
                    'checkIn_status',
                    'clg_name',
                    'hostel_name',
                    'block_name',
                    'room_no'
                ]
            );

        // dd($obj);

        if ($obj) {
            return response()->json([
                'success' => true,
                'message' => 'List Success!',
                'data' => $obj
            ], 200);
        } else {
            return response()->json([
                'success' => false,
                'message' => 'Failed!',
                'data' => ''
            ], 401);
        }
    }



    public function chkLatestRoombyID($chkInOut_id)
    {


        $obj = hep_hostel_checkInOut::select([
            'hep_hostel_chkinout.chkInOut_id',
            'hep_hostel_chkinout.stud_id',
            'hep_hostel_chkinout.checkIn',
            'hep_hostel_chkinout.checkOut',
            'hep_hostel_chkinout.checkIn_status',
            'hep_hostel_chkinout.checkOut_status',
            'hep_hostel_chkinout.reason',
            'hep_hostel_chkinout.recordstatus',
            'hep_hostel_chkinout.lastapproveon',

            'mis_std_info.sti_name',
            'mis_std_info.sti_icno',
            'mis_std_info.status_academic as FK_status_Student',
            'mis_std_info.sti_gender',
            'mis_std_info.sti_contactno_mobile',

            'mis_status.sts_status_name_en',

            // name hostel detail
            'clg_name',
            'hostel_name',
            'block_name',
            'room_no',

            'hep_hostel_chkinout.branch_id',
            'hep_hostel_chkinout.hostel_id',
            'hep_hostel_chkinout.block_id',
            'hep_hostel_chkinout.room_id'
        ])
            ->where([
                ['hep_hostel_chkinout.chkInOut_id', '=', $chkInOut_id],
                // ['hep_hostel_chkinout.recordstatus', '!=', 'DEL']
            ])
            ->leftjoin('mis_std_info', 'mis_std_info.std_studentid', '=', 'hep_hostel_chkinout.stud_id')
            ->leftjoin('mis_status', 'mis_status.sts_status_id', '=', 'mis_std_info.status_academic')

            ->leftjoin('mis_prm_college', 'mis_prm_college.pk_id', '=', 'hep_hostel_chkinout.branch_id')
            ->leftjoin('hep_hostel', 'hep_hostel.hostel_id', '=', 'hep_hostel_chkinout.hostel_id')
            ->leftjoin('hep_hostel_blok', 'hep_hostel_blok.block_id', '=', 'hep_hostel_chkinout.block_id')
            ->leftjoin('hep_hostel_room', 'hep_hostel_room.room_id', '=', 'hep_hostel_chkinout.room_id')

            ->latest()
            ->first();

        if ($obj) {
            return response()->json([
                'success' => 'true',
                'message' => 'List Success!',
                'data' => $obj
            ], 200);
        }
    }



    // check if ada student Check In Status==Check In, kena check out dulu sblm check in bilik baru 
    public function checkByFKCHkInOut($chkInOut_id)
    {
        $obj = hep_hostel_checkInOut::where([
            ['chkInOut_id', '=', $chkInOut_id],
            ['checkIn_status', '=', 'Check In'],
            ['recordstatus', '!=', 'DEL']
        ])
            ->first();
        if ($obj) {
            return response()->json([
                'success' => true,
                'message' => 'Success!',
                'data' => $obj
            ], 200);
        } else {
            return response()->json([
                'success' => false,
                'message' => 'Not Check In!',
                'data' => ''
            ], 401);
        }
    }



    // check if ada student Check In Status==Check In, kena check out dulu sblm check in bilik baru 
    public function reportingListStd(Request $request)
    {

        $results = hep_hostel_checkInOut::select([
            'hep_hostel_chkinout.chkInOut_id', 'hep_hostel_chkinout.stud_id', 'hep_hostel_chkinout.branch_id', 'hep_hostel_chkinout.hostel_id',
            'hep_hostel_chkinout.block_id', 'hep_hostel_chkinout.room_id', 'hep_hostel_chkinout.checkIn', 'hep_hostel_chkinout.checkOut',
            'hep_hostel_chkinout.checkIn_status', 'hep_hostel_chkinout.checkOut_status',
            'mis_std_info.pgm_fk', 'mis_std_info.pgm_id', 'mis_std_info.cur_intake', 'mis_std_info.sti_session_id',
            'mis_std_info.sti_icno', 'mis_std_info.sti_name', 'mis_std_info.status_academic', 'mis_std_info.sti_gender', 'mis_std_info.sti_religion',
            'mis_prm_college.clg_name',
            'hep_hostel.hostel_name', 'hep_hostel.hostel_warden', 'hep_hostel.hostel_status',
            'hep_hostel_blok.block_name', 'hep_hostel_blok.block_status', 'hep_hostel_blok.block_gender',
            'hep_hostel_room.room_no', 'hep_hostel_room.total_bed', 'hep_hostel_room.room_status',
            'hep_hostel_chkinout.recordstatus AS rc_chkInOut',
            'mis_std_info.recordstatus AS rc_stdInfo',
            'mis_std_info.sti_contactno_mobile',
            'mis_prm_college.recordstatus AS rc_clg',
            'hep_hostel.recordstatus AS rc_hostel',
            'hep_hostel_blok.recordstatus AS rc_blok',
            'hep_hostel_room.recordstatus AS rc_room'
        ])
            ->leftJoin('mis_std_info', 'mis_std_info.std_studentid', '=', 'hep_hostel_chkinout.stud_id')
            ->leftJoin('mis_prm_college', 'mis_prm_college.pk_id', '=', 'hep_hostel_chkinout.branch_id')
            ->leftJoin('hep_hostel', 'hep_hostel.hostel_id', '=', 'hep_hostel_chkinout.hostel_id')
            ->leftJoin('hep_hostel_blok', 'hep_hostel_blok.block_id', '=', 'hep_hostel_chkinout.block_id')
            ->leftJoin('hep_hostel_room', 'hep_hostel_room.room_id', '=', 'hep_hostel_chkinout.room_id')
            ->where('hep_hostel_chkinout.recordstatus', '!=', 'DEL')
            ->where('hep_hostel_chkinout.checkIn_status', '!=', 'Check Out')
            ->where('hep_hostel_chkinout.checkIn_status', '!=', 'Unreside')
            ->orderBy('hep_hostel_room.room_id')
            // ->where('hep_hostel_chkinout.branch_id', 3)
            // ->where('hep_hostel_chkinout.hostel_id', 18)
            ->get();

        if ($results) {
            return response()->json([
                'success' => true,
                'message' => 'Success',
                'data' => $results
            ], 200);
        } else {
            return response()->json([
                'success' => false,
                'message' => 'No Data!',
                'data' => ''
            ], 401);
        }
    }
}
