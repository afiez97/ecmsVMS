<?php

namespace App\Models;

use Illuminate\Auth\Authenticatable;
use Illuminate\Contracts\Auth\Access\Authorizable as AuthorizableContract;
use Illuminate\Contracts\Auth\Authenticatable as AuthenticatableContract;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Laravel\Lumen\Auth\Authorizable;

class mis_std_info extends Model
{
    const UPDATED_AT = 'lastupdateon';
    const CREATED_AT = 'lastapproveon';
    
    protected $table = 'mis_std_info';
    protected $fillable = [
        'std_studentid',
        'pgm_id',
        'pgm_fk',
        'sti_password',
        'nosiri',
        'sti_icno',
        'sti_name',
        'cur_intake',
        'sti_gender',
        'sti_session_id',
        'sti_nationality',
        'sti_race',
        'sti_status_bumiputra',
        'sti_religion',
        'sti_status_oku',
        'sti_blood_type',
        'sti_email',
        'sti_address_1',
        'sti_address_2',
        'sti_address_3',
        'sti_postcode',
        'sti_state',
        'sti_contactno_home',
        'sti_contactno_mobile',
        'sti_bank_id',
        'sti_bank_accountno',
        'sti_image',
        'sti_image_path',
        'sti_password_reset',
        'sti_signon',
        'sti_last_signon',
        'sti_signon_status',
        'sti_token',
        'lastupdateon',
        'lastupdateby',
        'lastapproveon',
        'lastapproveby',
        'recordstatus',
        'cam_id',
        'marital_status',
        'status_academic',
        'duration_std',
        'remark',
        'staff_alumi',
        'sti_sponsorship',
        'sti_asnaf',
        'sti_baitulmal',
    ];

    protected $hidden = [
        'sti_password','sti_token'
    ];
}
