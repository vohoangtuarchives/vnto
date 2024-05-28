<?php
namespace Def\Core;
use Def\Core\Contract\ControllerContract;
use Def\HTTP\ThrottlesLogins;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Log;

abstract class BaseController extends Controller implements ControllerContract {
    use AuthorizesRequests, ValidatesRequests;
    use ThrottlesLogins;


    protected function logException(\Exception $e)
    {
        Log::error(
            "{$e->getMessage()}:
                 {$e->getFile()}:
                 {$e->getLine()}"
        );
    }

    /**
     * API status always 200
     * If there is any errors, we return addtional errors data to response
     * @param $data
     *
     * @return \Illuminate\Http\JsonResponse
     */
    protected function success($data): \Illuminate\Http\JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => $data
        ]);
    }

    /**
     * API status always 200
     * If there is any errors, we return addtional errors data to response
     * @param $data
     * @param array $errors
     *
     * @return \Illuminate\Http\JsonResponse
     */
    protected function apiResponse($data ,array $errors = [])
    {
        return response()->json([
            'success' => empty($errors),
            'data' => $data,
            'errors' => $errors
        ], 200);
    }


    /**
     * Return API reponse with data NULL and log Exception
     * @param \Exception $e
     * @param $message
     * @return JsonResponse
     */
    protected function exception(\Exception $e, $status = Response::HTTP_BAD_REQUEST)
    {
        $this->logException($e);
        $errors = [
            'message' => $e->getMessage(),
            'status' => $status
        ];
        return $this->apiResponse(null, $errors);
    }
}