<?php

namespace App\Http\Controllers;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\JsonResponse;

abstract class Controller
{
    // Set view data in this variable
    protected array $data;

    // Set view path in this variable
    protected string $view_path;


    //Handle error view
    protected function handleError(\Throwable $err): Response 
    {
        $this->data['error'] = app()->environment('production') ? "Server Error" : $err->getMessage();
        return Inertia::render(
            'Error/ServerError',
            $this->data,
        );
    }

    //Handle Json error 
    protected function handleJsonError(\Throwable $err): JsonResponse
    {
        $this->data['msg'] = app()->environment('production') ? "Server Error" : $err->getMessage();
        $this->data['code'] = 500;
        return response()->json($this->data, 500);
    }

}
