<?php

namespace App\Models;

use Illuminate\Auth\Authenticatable;
use Illuminate\Contracts\Auth\Access\Authorizable as AuthorizableContract;
use Illuminate\Contracts\Auth\Authenticatable as AuthenticatableContract;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Laravel\Lumen\Auth\Authorizable;

class hep_hostel_checkInOut extends Model implements AuthenticatableContract, AuthorizableContract
{
    use Authenticatable, Authorizable, HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */

    const UPDATED_AT = 'lastupdateon';
    const CREATED_AT = 'lastapproveon';

    protected $table = 'hep_hostel_chkinout';
    protected $primaryKey = 'chkInOut_id';

    protected $fillable = [
        'chkInOut_id','fk_booking','fk_hstlChg','type','branch_id','hostel_id','block_id','room_id','bed_id','stud_id','stud_intake','stud_modestudy','checkIn','checkOut',
        'checkIn_status','checkOut_status','reason', 'check_agree','notify_admin','notify_std','notify_warden',
        'lastupdateon', 'lastupdateby', 'lastapproveon', 'lastapproveby', 'recordstatus'
    ];
}
