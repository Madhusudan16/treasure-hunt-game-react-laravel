import { useState, useEffect } from 'react';
import { Input, Button } from "@material-tailwind/react";

const Result = ({ count, result, username }) => {
    const [gridArr, setGridArr] = useState([]);
    console.log(result);
    useEffect(() => {
            const tempGridArr= [];
            for (let i = 0; i < count; i++) { 
                let tmp = [];

                for (let j = 0; j < count; j++) {
                    console.log(result[i]);
                    if (result[i] && result[i][j]) { 
                        tmp.push(result[i][j]);    
                    } else {
                        tmp.push(" ");
                    }
                    
                }
                tempGridArr[i] = tmp;
            }
            setGridArr(tempGridArr);
            
        
    }, []);
    return (
        <>
            <div className='h-screen content-center text-center items-center justify-center align-middle'>
                <h5 className='mb-10'>Username:  
                    <strong>
                        {username ?? ''}
                    </strong>
                </h5>
                    {
                        gridArr.map((row, rowIndex) => { 
                            return row.map((val, colIndex) => {
                                return (
                                    <>
                                        <Button
                                            key={rowIndex + colIndex}
                                            row={rowIndex}
                                            col={colIndex}
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
                </div>
        </>
    )

};
export default Result;