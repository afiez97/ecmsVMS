<?php

namespace App\Models;

use Illuminate\Auth\Authenticatable;
use Illuminate\Contracts\Auth\Access\Authorizable as AuthorizableContract;
use Illuminate\Contracts\Auth\Authenticatable as AuthenticatableContract;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Laravel\Lumen\Auth\Authorizable;

class hep_capaianUsr extends Model implements AuthenticatableContract, AuthorizableContract
{
    use Authenticatable, Authorizable, HasFactory;


    // const UPDATED_AT = 'created_at';
    // const CREATED_AT = 'updated_at';
    protected $primaryKey = 'id_capaianUsr';

    protected $table = 'hep_capaianUsr';

    protected $fillable = [
        'id_capaianUsr',
        'FK_users', 'FK_capaianjenis', 
        'created_at','updated_at', 
        'created_by','updated_by', 
        'recordstatus'
    ];

    
    // protected $hidden = [
    //     'recordstatus',
    // ];
}
