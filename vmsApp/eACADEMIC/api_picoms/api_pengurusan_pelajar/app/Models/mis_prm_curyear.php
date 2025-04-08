<?php

namespace App\Models;

use Illuminate\Auth\Authenticatable;
use Illuminate\Contracts\Auth\Access\Authorizable as AuthorizableContract;
use Illuminate\Contracts\Auth\Authenticatable as AuthenticatableContract;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Laravel\Lumen\Auth\Authorizable;

class mis_prm_curyear extends Model
{

    /**
     * The name of the "updated at" column.
     *
     * @var string
     */
    const UPDATED_AT = 'lastupdateon';

    protected $table = 'mis_prm_curyear';
    protected $fillable = [
        'pgm_id', 
        'cur_year', 
        'cur_intake',
        'cur_semester',
        'cur_status',
        'lastupdateon',
        'lastupdateby',
        'lastapproveby',
        'lastapproveon',
        'recordstatus',
    ];
}
