<?php
namespace Def\API\Controllers;

use Def\Core\BaseController;
use Def\Services\AuthService;
use Illuminate\Http\Request;

class AuthController extends BaseController{
    public function __construct(protected AuthService $authService){}

    public function login(Request $request)
    {
        try {
            return $this->success($this->authService->login($request));
        }catch (\Exception $exception){
            return $this->exception($exception, $exception->getMessage());
        }
    }
}