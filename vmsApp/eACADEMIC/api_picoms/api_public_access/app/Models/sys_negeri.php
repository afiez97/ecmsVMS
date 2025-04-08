<?php

namespace App\Models;

use Illuminate\Auth\Authenticatable;
use Illuminate\Contracts\Auth\Access\Authorizable as AuthorizableContract;
use Illuminate\Contracts\Auth\Authenticatable as AuthenticatableContract;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Laravel\Lumen\Auth\Authorizable;

class sys_negeri extends Model
{
    protected $table = 'sys_negeri';
    protected $fillable = [
        'kod', 
        'kodnegeri', 
        'ringkasan',
        'nama',
        'kodnegara',
        'ent_opr',
        'ent_date',
        'mod_opr',
        'mod_date'
    ];
}
