<?php
namespace Def\Repository\User;

use Def\Core\BaseModel;
use Def\Core\BaseRepository;
use Def\Models\User;
use Illuminate\Database\Eloquent\Model;

class UserRepository extends BaseRepository implements UserRepositoryContract
{
    public function __construct(protected User $user)
    {
        parent::__construct($user);
    }

}