<?php

namespace App\Models;

use Illuminate\Auth\Authenticatable;
use Illuminate\Contracts\Auth\Access\Authorizable as AuthorizableContract;
use Illuminate\Contracts\Auth\Authenticatable as AuthenticatableContract;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Laravel\Lumen\Auth\Authorizable;

class mis_std_academic extends Model
{
    const UPDATED_AT = 'lastupdateon';
    const CREATED_AT = 'lastapproveon';
    
    protected $table = 'mis_std_academic';
    protected $fillable = [
        'std_studentid',
        'sta_muet',
        'sta_bm_spm',
        'sta_bi_spm',
        'sta_math_spm',
        'sta_his_spm',
        'sta_islam_spm',
        'sta_other1_spm',
        'sta_other2_spm',
        'sta_other3_spm',
        'sta_other4_spm',
        'sta_other5_spm',
        'sta_sub1_spm',
        'sta_sub2_spm',
        'sta_sub3_spm',
        'sta_sub4_spm',
        'sta_sub5_spm',
        'sta_spm_doc',
        'lastupdateon',
        'lastupdateby',
        'lastapproveon',
        'lastapproveby',
        'recordstatus',
    ];

    protected $hidden = [
        'password','api_token'
    ];
}
