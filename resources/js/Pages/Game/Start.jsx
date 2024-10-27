import { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { Input, Button } from "@material-tailwind/react";
import { post } from '@/Configs/Request';

const Start = () => {
    let n_flag = 1;
    const [count, setCount] = useState(''); 
    const [username, setUsername] = useState('');
    const [gridArr, setGridArr] = useState([]);
    const [found, setFound] = useState(0); 
    const [notFound, setNotFound] = useState(0);
    const [isStart, setIsStart] = useState(0);


    const resetGame = () => { 
        setCount('');
        setUsername('');
        setGridArr([]);
        setFound(0);
        setNotFound(0);
        setIsStart(0);
    }

    const verify = async(row, col, event) => { 
        try { 
            if (gridArr[row][col].trim().length !== 0) return false;
            const response =   await post('verify', {
                username, 
                value: event?.target?.attributes?.getNamedItem('data')?.value, 
                row,
                col
            }); 
            if (response?.is_success && response?.data) {
                let isFound = response?.data?.is_found ?? false; 
                gridArr[row][col] = isFound ? '💎' : '👎'; 
                setGridArr([...gridArr]);
                if (isFound) {
                    let k = found + 1;
                    setFound(k);
                    if (k == count) {
                        alert("Hey you found all!!");
                        setIsStart(2);
                    }
                    
                } else { 
                    let k = notFound + 1;
                    setNotFound(k);
                }
            }  
        } catch (err) {
            console.log(err);
        }
    }

    const startGame = async() => {
        try {
            if (username.trim().length == 0 || count < 2) {
                alert("Invalid form data");
                return false;
            }
            const response = await post('start_game', {
                username,
                count
            });
            console.log(response);
            if (!response.is_success) {
                return;
            }
            const tempGridArr= [];
            for (let i = 0; i < count; i++) { 
                let tmp = [];
                 for (let j = 0; j < count; j++) {
                     tmp.push(" ");
                 }
                tempGridArr[i] = tmp;
                
            }
            setGridArr(tempGridArr);
            setIsStart(1);
        } catch (err) { 
            console.log(err);
        }
    };

    return (
        <div className='h-screen mt-20 text-center  justify-center '>
            <div className='p-10 flex justify-center '>
                <div className="grid gap-x-8 gap-y-4 grid-cols-3">
                    <Input
                        label="Username"
                        name="username"
                        onChange={(e) => setUsername(e.target.value)}
                        disabled={isStart == 1}
                        value={username}
                    />
                    <Input
                        onChange={(e) => setCount(e.target.value) }
                        label="Grid"
                        name="grid"
                        disabled={isStart == 1}
                        value={count}
                    />
                    {isStart ?
                        <Button onClick={resetGame}>
                            Reset
                        </Button>
                        :
                        <Button onClick={startGame}>
                            Start
                        </Button>
                    }
                    
                </div>
            </div>
            {isStart ?
                <div className='grid grid-flow-col auto-cols-max justify-center p-5'>
                    <div>
                        💎 : <strong>{found}</strong>
                    </div>
                    <div className='ml-5'>
                        👎 : <strong>{notFound}</strong>
                    </div>
                </div>
            : null}
            <div className='text-center'>
                    {
                        gridArr.map((row, rowIndex) => { 
                            return row.map((val, colIndex) => {
                                return (
                                    <>
                                        
                                        <Button
                                            onClick={(e) => {
                                                verify(rowIndex, colIndex, e);
                                            }}
                                            key={rowIndex + colIndex}
                                            row={rowIndex}
                                            col={colIndex}
                                            data={n_flag++}
                                            disabled={isStart == 2 }
                                            className='m-0.5 w-10 h-10'
                                            color='teal'
                                        >
                                            <span style={{ 
                                                margin:"-8px"
                                             }} className='text-center text-xl'>{gridArr[rowIndex][colIndex]}</span>
                                        </Button>
                                        {(colIndex == count -1) ? <br/> : null } 
                                    </>    
                                )
                            });
                        })
                }
                {isStart == 2 ?
                    <Link className='p-10' href="/game/result">
                        <Button>
                            View Result
                        </Button>
                    </Link>
                    : null
                }
                </div>
        </div>
    );
}; 

export default Start;