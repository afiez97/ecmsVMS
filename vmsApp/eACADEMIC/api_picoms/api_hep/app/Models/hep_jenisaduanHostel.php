<?php

namespace App\Models;

use Illuminate\Auth\Authenticatable;
use Illuminate\Contracts\Auth\Access\Authorizable as AuthorizableContract;
use Illuminate\Contracts\Auth\Authenticatable as AuthenticatableContract;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Laravel\Lumen\Auth\Authorizable;

class hep_jenisaduanHostel extends Model implements AuthenticatableContract, AuthorizableContract
{
    use Authenticatable, Authorizable, HasFactory;


    // const UPDATED_AT = 'lastupdateon';
    // const CREATED_AT = 'lastapproveon';

    protected $table = 'hep_jenisaduanHostel';
    protected $primaryKey = 'pk_id';

    protected $fillable = [
        'pk_id',
        'aduan_code', 'aduan_nama', 'aduan_remarks',
        'lastupdateby','lastapproveby', 
        'created_at',  'updated_at', 
        'recordstatus'
    ];

    // protected $hidden = [
    //     'recordstatus',
    // ];
}
