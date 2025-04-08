<?php

namespace App\Models;

use Illuminate\Auth\Authenticatable;
use Illuminate\Contracts\Auth\Access\Authorizable as AuthorizableContract;
use Illuminate\Contracts\Auth\Authenticatable as AuthenticatableContract;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Laravel\Lumen\Auth\Authorizable;

class hep_capaianjenis extends Model implements AuthenticatableContract, AuthorizableContract
{
    use Authenticatable, Authorizable, HasFactory;


    // const UPDATED_AT = 'updated_at';
    // const CREATED_AT = 'created_at';

    protected $table = 'hep_capaianjenis';
    protected $primaryKey = 'id_jenisCapaian';

    protected $fillable = [
        'id_jenisCapaian', 'namaCapaian', 'uniqueCapaian', 
        'created_at','updated_at', 'created_by','updated_by', 
        'recordstatus'
    ];

   
    // protected $hidden = [
    //     'recordstatus',
    // ];
}
