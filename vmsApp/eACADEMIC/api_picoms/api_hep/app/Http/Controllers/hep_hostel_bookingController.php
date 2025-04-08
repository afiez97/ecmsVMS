<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use App\Models\hep_hostel_booking;
use Illuminate\Support\Facades\Mail;

class hep_hostel_bookingController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }

    public function register(Request $request)
    {
        $branch_id = $request->input('branch_id');
        $hostel_id = $request->input('hostel_id');
        $block_id = $request->input('block_id');
        $room_id = $request->input('room_id');
        // $bed_id = $request->input('bed_id');
        $stud_id = $request->input('stud_id');
        $expected_chkInDate = $request->input('expected_chkInDate');
        $booking_status = $request->input('booking_status');
        $recordstatus = $request->input('recordstatus');

        $obj = hep_hostel_booking::create([
            'branch_id' => $branch_id,
            'hostel_id' => $hostel_id,
            'block_id' => $block_id,
            'room_id' => $room_id,
            // 'bed_id' => $bed_id,
            'stud_id' => $stud_id,
            'expected_chkInDate' => $expected_chkInDate,
            'booking_status' => $booking_status,
            'recordstatus' => $recordstatus
        ]);

        if ($obj) {

            if ($booking_status == 'New') {
                $EmailPurpose = hep_hostel_booking::where('booking_id', $obj->booking_id)
                    ->leftJoin('mis_prm_college', 'mis_prm_college.pk_id', '=', 'hep_hostel_booking.branch_id')
                    ->leftJoin('hep_hostel', 'hep_hostel.hostel_id', '=', 'hep_hostel_booking.hostel_id')
                    ->leftJoin('hep_hostel_blok', 'hep_hostel_blok.block_id', '=', 'hep_hostel_booking.block_id')
                    ->leftJoin('hep_hostel_room', 'hep_hostel_room.room_id', '=', 'hep_hostel_booking.room_id')
                    ->leftJoin('mis_std_info', 'mis_std_info.std_studentid', '=', 'hep_hostel_booking.stud_id')
                    ->select(
                        'mis_std_info.sti_name',
                        'hep_hostel_booking.stud_id',
                        'mis_prm_college.clg_name',
                        'hep_hostel.hostel_name',
                        'hep_hostel_blok.block_name',
                        'hep_hostel_room.room_no',
                        'hep_hostel_booking.*'
                    )
                    ->first(); // Or get() if you expect multiple results

                $data = array(
                    'name' => $EmailPurpose->sti_name,
                    'idStdStaff' => $EmailPurpose->stud_id,
                    'title' => 'You have received a <b>Hostel Booking Application</b> according to the details below:',
                    'Hostel' => $EmailPurpose->hostel_name,
                    'Block' => $EmailPurpose->block_name,
                    'Room' => $EmailPurpose->room_no,
                    'content' => "
                          <style>
            td, th {
                border: 1px solid #dddddd;
                text-align: left; padding: 8px;
            }
            .title {
                background-color: #dddddd;
            }
        </style>
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
                <td style='background-color: #dddddd; text-align: left; padding: 0 8px;'>Applied Hostel</td>
                <td style='text-align: left; padding: 0 8px;'>{$EmailPurpose->hostel_name}</td>
            </tr>
            <tr>
                <td style='background-color: #dddddd; text-align: left; padding: 0 8px;'>Applied Block</td>
                <td style='text-align: left; padding: 0 8px;'>{$EmailPurpose->block_name}</td>
            </tr>
            <tr>
                <td style='background-color: #dddddd; text-align: left; padding: 0 8px;'>Applied Room</td>
                <td style='text-align: left; padding: 0 8px;'>{$EmailPurpose->room_no}</td>
            </tr>
            <tr>
                <td style='background-color: #dddddd; text-align: left; padding: 0 8px;'>Status</td>
                <td style='text-align: left; padding: 0 8px;'><strong>{$booking_status}</strong></td>
            </tr>
        </table>
                    ",
                );
                // dd($EmailPurpose);

                Mail::send('mail', $data, function ($message) use ($data, $EmailPurpose) {
                    // $message->to($array->std_id.'@gmail.com',  $array->std_name)->subject('Hostel Booking Application');
                    $message->to('hostel@ucmi.edu.my', 'UNIT PENGURUSAN HOSTEL')
                    // $message->to('ehepa@ucmi.edu.my', 'Hal Ehwal Pelajar')
                    ->subject('Hostel Booking Application');
                    // $message->to('mohdafiez7@gmail.com', 'Test Name')->subject('Hostel Booking Application');
                    $message->from($EmailPurpose->stud_id . '@student.ucmi.edu.my',  $EmailPurpose->sti_name);
                });
            }

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


    public function show($id)
    {

        $obj = hep_hostel_booking::where([
            ['hep_hostel_booking.stud_id','=',$id],
            ['hep_hostel_booking.booking_status','!=','Accept'],
            ['hep_hostel_booking.recordstatus','!=','DEL'],
            ['hep_hostel_booking.booking_status','!=','Reject'],
            ])
        // $obj = hep_hostel_booking::where('cal_id', $id)
            ->first();

        if ($obj) {
            return response()->json([
                'success' => true,
                'message' => 'Show Success!',
                'data' => $obj
            ], 200);
        }else{
            return response()->json([
                'success' => false,
                'message' => 'Show Success!',
                'data' => 'No Data'
            ], 200);
        }

    }


    public function list()
    {
        $obj = hep_hostel_booking::where([['hep_hostel_booking.recordstatus', '!=', 'DEL']])
            ->leftjoin('mis_prm_college', 'mis_prm_college.pk_id', '=', 'hep_hostel_booking.branch_id')
            ->leftjoin('hep_hostel', 'hep_hostel.hostel_id', '=', 'hep_hostel_booking.hostel_id')
            ->leftjoin('hep_hostel_blok', 'hep_hostel_blok.block_id', '=', 'hep_hostel_booking.block_id')
            ->leftjoin('hep_hostel_room', 'hep_hostel_room.room_id', '=', 'hep_hostel_booking.room_id')
            ->leftjoin('hep_hostel_bed', 'hep_hostel_bed.bed_id', '=', 'hep_hostel_booking.bed_id')
            ->leftjoin('mis_std_info', 'mis_std_info.std_studentid', '=', 'hep_hostel_booking.stud_id')
            ->orderByRaw("
            CASE 
                WHEN booking_status = 'New' THEN 0
                ELSE 1
            END
                        ")
            ->orderBy('hep_hostel_booking.booking_id', 'desc') // Add this line for sorting
            ->get([
                'booking_id',
                'branch_id',
                'clg_name',
                'hep_hostel_booking.hostel_id AS hostelId',
                'hostel_name',
                'hep_hostel_booking.block_id AS blockId',
                'block_name',
                'hep_hostel_booking.room_id AS roomId',
                'room_no',
                'hep_hostel_booking.bed_id AS bedId',
                'bed_no',
                'stud_id',
                'expected_chkInDate',
                'booking_status',
                'sti_name'
            ]);

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
        $booking_id = $request->input('booking_id');
        $branch_id = $request->input('branch_id');
        $hostel_id = $request->input('hostel_id');
        $block_id = $request->input('block_id');
        $room_id = $request->input('room_id');
        $notify_std = $request->input('notify_std');
        $stud_id = $request->input('stud_id');
        $expected_chkInDate = $request->input('expected_chkInDate');
        $booking_status = $request->input('booking_status');
        $recordstatus = $request->input('recordstatus');


        $dataHstl = $request->input('dataHstl');

        $obj = hep_hostel_booking::where([['booking_id', '=', $booking_id]])->update([
            'branch_id' => $branch_id,
            'hostel_id' => $hostel_id,
            'block_id' => $block_id,
            'room_id' => $room_id,
            'notify_std' => $notify_std,
            'stud_id' => $stud_id,
            'expected_chkInDate' => $expected_chkInDate,
            'booking_status' => $booking_status,
            'recordstatus' => $recordstatus
        ]);


        $array = json_decode($dataHstl);


        $data = array(
            'name'=> $array->std_name,
            'idStdStaff'=> $array->std_id,
            'title' => "Your <b>Hostel Booking Application</b> has been updated according to the details below:",
            'Hostel'=> $array->hstl_name,
            'Block'=> $array->blok_name,
            'Room'=> $array->room_name,
            'content' => "
        <table border='1' style='font-family: arial, sans-serif; border-collapse: collapse; width: 100%;'>
            <tr>
                <th colspan='2'><strong>Hostel Application Details</strong></th>
            </tr>
            <tr>
                <td style='background-color: #dddddd; text-align: left; padding: 0 8px;'>Campus</td>
                <td style='text-align: left; padding: 0 8px;'>{$array->campus_name}</td>
            </tr>
            <tr>
                <td style='background-color: #dddddd; text-align: left; padding: 0 8px;'>Student ID</td>
                <td style='text-align: left; padding: 0 8px;'>{$array->std_id}</td>
            </tr>
            <tr>
                <td style='background-color: #dddddd; text-align: left; padding: 0 8px;'>Student Name</td>
                <td style='text-align: left; padding: 0 8px;'>{$array->std_name}</td>
            </tr>
            <tr>
                <td style='background-color: #dddddd; text-align: left; padding: 0 8px;'>Applied Hostel</td>
                <td style='text-align: left; padding: 0 8px;'>{$array->hstl_name}</td>
            </tr>
            <tr>
                <td style='background-color: #dddddd; text-align: left; padding: 0 8px;'>Applied Block</td>
                <td style='text-align: left; padding: 0 8px;'>{$array->blok_name}</td>
            </tr>
            <tr>
                <td style='background-color: #dddddd; text-align: left; padding: 0 8px;'>Applied Room</td>
                <td style='text-align: left; padding: 0 8px;'>{$array->room_name}</td>
            </tr>
            <tr>
                <td style='background-color: #dddddd; text-align: left; padding: 0 8px;'>Status</td>
                <td style='text-align: left; padding: 0 8px;'><strong>{$booking_status}</strong></td>
            </tr>
        </table>
    ",
        );
      
        if ($dataHstl) {
            if ($booking_status != 'New') {  
                Mail::send('mail', $data, function($message) use ($data, $array) {
                    // $message->to('mohdafiez7@gmail.com',  '$array->std_name')->subject('Hostel Booking Application');
                    $message->to($array->std_id.'@student.ucmi.edu.my',  $array->std_name)->subject('Hostel Booking Application');
                    // $message->to('mohdafiez7@gmail.com', 'Test Name')->subject('Hostel Booking Application');
                    $message->from('hostel@ucmi.edu.my','UNIT PENGURUSAN HOSTEL');
                    // $message->from('ehepa@ucmi.edu.my','hepa');

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


    public function delete(Request $request)
    {
        $recordstatus = $request->input('recordstatus');
        $booking_id = $request->input('booking_id');

        $obj = hep_hostel_booking::where('booking_id', $booking_id)->update([
            'recordstatus' => $recordstatus,
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


    public function countAlert()
    {
        $obj = hep_hostel_booking::where([['recordstatus', '!=', 'DEL'], ['booking_status', '=', 'New']])->get(['booking_id']);

        if ($obj) {
            return response()->json([
                'success' => 'true',
                'message' => 'List Success!',
                'data' => $obj
            ], 200);
        }
    }


    public function listByStud($id)
    {
        $obj = hep_hostel_booking::where([['hep_hostel_booking.stud_id', '=', $id], ['hep_hostel_booking.recordstatus', '!=', 'DEL']])
            ->leftjoin('mis_prm_college', 'mis_prm_college.pk_id', '=', 'hep_hostel_booking.branch_id')
            ->leftjoin('hep_hostel', 'hep_hostel.hostel_id', '=', 'hep_hostel_booking.hostel_id')
            ->leftjoin('hep_hostel_blok', 'hep_hostel_blok.block_id', '=', 'hep_hostel_booking.block_id')
            ->leftjoin('hep_hostel_room', 'hep_hostel_room.room_id', '=', 'hep_hostel_booking.room_id')
            ->leftjoin('hep_hostel_bed', 'hep_hostel_bed.bed_id', '=', 'hep_hostel_booking.bed_id')
            ->orderBy('hep_hostel_booking.expected_chkInDate', 'desc')
            ->get([
                'booking_id',
                'branch_id',
                'clg_name',
                'hep_hostel_booking.hostel_id AS hostelId',
                'hostel_name',
                'hep_hostel_booking.block_id AS blockId',
                'block_name',
                'hep_hostel_booking.room_id AS roomId',
                'room_no',
                'hep_hostel_booking.bed_id AS bedId',
                'bed_no',
                'expected_chkInDate',
                'booking_status',
                'notify_std'
            ]);

        if ($obj) {
            return response()->json([
                'success' => 'true',
                'message' => 'List Success!',
                'data' => $obj
            ], 200);
        }
    }


    // update by student
    public function uptByStd(Request $request)
    {
        $booking_id = $request->input('booking_id');
        $branch_id = $request->input('branch_id');
        $hostel_id = $request->input('hostel_id');
        $block_id = $request->input('block_id');
        $room_id = $request->input('room_id');
        $bed_id = $request->input('bed_id');
        $expected_chkInDate = $request->input('expected_chkInDate');
        $recordstatus = $request->input('recordstatus');

        $obj = hep_hostel_booking::where([['booking_id', '=', $booking_id]])->update([
            'branch_id' => $branch_id,
            'hostel_id' => $hostel_id,
            'block_id' => $block_id,
            'room_id' => $room_id,
            'bed_id' => $bed_id,
            'expected_chkInDate' => $expected_chkInDate,
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


    // alert in portal student when status==Reject & notify_std==Yes
    public function alertBookStd($id)
    {
        $obj = hep_hostel_booking::where([
            ['recordstatus', '!=', 'DEL'],
            ['booking_status', '=', 'Reject'],
            ['notify_std', '=', 'Yes'],
            ['stud_id', '=', $id]
        ])
            ->get(['booking_id']);

        if ($obj) {
            return response()->json([
                'success' => 'true',
                'message' => 'List Success!',
                'data' => $obj
            ], 200);
        }
    }


    // update status
    public function uptStatus(Request $request)
    {
        $booking_id = $request->input('booking_id');
        $booking_status = $request->input('booking_status');
        $recordstatus = $request->input('recordstatus');

        $obj = hep_hostel_booking::where([['booking_id', '=', $booking_id]])->update([
            'booking_status' => $booking_status,
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


    // student update notify Reject
    public function uptNotifyStd($id)
    {
        $obj = hep_hostel_booking::where([['booking_id', '=', $id]])->update(['notify_std' => 'No']);

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



    // student update notify Reject
    public function checkingRoomBooked($room_id)
    {
        $obj = hep_hostel_booking::
        where([
            ['room_id', '=', $room_id],
            ['booking_status', '=','New'],
            ['recordstatus', '!=','DEL']])
        ->get();

        if ($obj) {
            return response()->json([
                'success' => true,
                'message' => "Update Success!",
                'count' => $obj->count(),
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
}
