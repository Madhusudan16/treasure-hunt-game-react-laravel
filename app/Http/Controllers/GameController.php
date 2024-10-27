<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Inertia\Inertia;
use Inertia\Response;
use App\Http\Requests\GameStartRequest;

class GameController extends Controller
{
    /** 
     * Set default setting here 
     * @param void  
     * @return void  
     */
    public function  __construct() 
    {
        $this->view_path = 'Game/';
        $this->data['page_title'] = "Game";
    }

    /** 
     * Display game page 
     * @param Request $request 
     * @return Response 
     */
    public function initGame(Request $request): Response 
    {
        try { 
            return Inertia::render(
                $this->view_path.'Start', 
                $this->data
            );
        } catch(\Throwable $err) { 
            return handleError($err);
        }
    }

    /** 
     * Start Game 
     * @param GameStartRequest $request 
     * @return JsonResponse
     */
    public function startGame(GameStartRequest $request): JsonResponse 
    {
        try { 
            $username = $request->username;
            $gridNo = (int) $request->count; 
            
            $session = [
                'username' => $username,
                'count' => $gridNo, 
                'treasure' => $this->getRandomNum($gridNo)
            ];         
            session(["game_on" => $session]);
            session(["result" => array([]) ]);
            $this->data['code'] = 200;
            $this->data['msg'] = "Start game"; 
            return response()->json($this->data, $this->data['code']);
        } catch(\Throwable $err) {
            return $this->handleJsonError($err);
        }
    } 

    /**
     * Generate random number 
     * @param int count 
     * @return array
     */
    private function getRandomNum(int $count): array 
    {
        $random = array();
        $min = 1;
        $max = $count * $count;
        
        for(;;) {
            $num = rand($min, $max);
            if(!in_array($num, $random)) { 
                $random[] = $num;
            }
            if(count($random) == $count) break;
        }
        return $random;
    }

    /** 
     * Verify treasure value 
     * @param Request $request
     * @return JsonResponse
     */
    public function isTreasureFound(Request $request): JsonResponse 
    {
        try { 
            $sessionData  = $request->session()->get("game_on");
            $result  = $request->session()->get("result");
            $treasure = $sessionData['treasure'];
            $this->data['is_found'] = 0;
            $result[$request->row][$request->col] = '👎';
            if(in_array($request->value, $treasure)) { 
                $this->data['is_found'] = 1;
                $result[$request->row][$request->col] = '💎';
            }
            session(["result" => $result]);
            $this->data['code'] = 200;
            $this->data['msg'] = "Verified";
            return response()->json($this->data, $this->data['code']);
        } catch(\Throwable $err) {
            return $this->handleJsonError($err);
        }
    }

    /** 
     * Verify treasure value 
     * @param Request $request
     * @return JsonResponse
     */
    public function displayResult(Request $request): Response 
    {
        try { 
            $sessionData  = $request->session()->get("game_on");
            $this->data['count'] = $sessionData['count']; 
            $this->data['username'] = $sessionData['username'];
            $result  = $request->session()->get("result");
            $this->data['result'] = $result;
            $request->session()->forget(["result","game_on"]);
            return Inertia::render(
                $this->view_path.'Result', 
                $this->data
            );
        } catch(\Throwable $err) { 
            return handleError($err);
        }
    }
}
