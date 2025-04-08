<?php

namespace App\Models;

use Illuminate\Auth\Authenticatable;
use Illuminate\Contracts\Auth\Access\Authorizable as AuthorizableContract;
use Illuminate\Contracts\Auth\Authenticatable as AuthenticatableContract;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Laravel\Lumen\Auth\Authorizable;

class mis_std_chg_program extends Model
{
    /**
     * The name of the "updated at" column.
     *
     * @var string
     */
    const UPDATED_AT = 'lastupdateon';

    protected $table = 'mis_std_chg_program';
    protected $fillable = [
        'studentid',
        'std_name',
        'noic',
        'std_pre_programme',
        'std_new_programme',
        'std_dekanStatus',
        'std_new_fac',
        'std_new_fee',
        'std_lampiran',
        'lastupdateby',
        'lastapproveby',
        'recordstatus'
    ];
}
