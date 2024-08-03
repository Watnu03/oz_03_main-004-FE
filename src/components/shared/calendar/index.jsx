import React, { useEffect, useState } from 'react';
import useCalendar from '../../../hooks/useCalendar';
import { subMonths, addMonths, format } from 'date-fns';
import useDate from '../../../store/dateStore';
import { todoAPI } from '../../../apis/api/todo';
import { refineCompletedTodos } from '../../../apis/services/calendarService';
import useCalendarStore from '../../../store/todosCompleteStore';

// 요일 목록
const DAY_LIST = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const Calendar = () => {
    const { weekCalendarList, currentDate, setCurrentDate } = useCalendar();
    // useDate store에서 선택된 날짜 상태와 setter 함수 가져오기
    const { selectedDate, setSelectedDate } = useDate((state) => state);
    // 완료된 할 일 개수를 저장할 state
    const { completedCounts, fetchCalendarData } = useCalendarStore();

    useEffect(() => {
        const year = format(currentDate, 'yyyy');
        const month = format(currentDate, 'MM');
        fetchCalendarData(year, month);
    }, [currentDate]);

    // 이전 달로 이동하는 함수
    const handlePrevMonth = () => {
        setCurrentDate(subMonths(currentDate, 1));
    };

    // 다음 달로 이동하는 함수
    const handleNextMonth = () => {
        setCurrentDate(addMonths(currentDate, 1));
    };

    // 날짜 클릭 시 선택된 날짜 업데이트 함수
    const handleDateClick = (day) => {
        if (day !== 0) {
            const formattedDate = format(
                new Date(currentDate.getFullYear(), currentDate.getMonth(), day),
                'yyyy-MM-dd'
            );
            setSelectedDate(formattedDate);
        }
    };

    const getBackgroundColor = (count) => {
        if (count >= 10) return 'bg-[#421D06]';
        if (count >= 8) return 'bg-[#743A13]';
        if (count >= 6) return 'bg-[#8B4513]';
        if (count >= 4) return 'bg-[#AD5A10]';
        if (count >= 1) return 'bg-[#AD5A10] bg-opacity-50';
        return '';
    };

    return (
        <div className='flex h-full flex-col'>
            <div className='flex w-full justify-between'>
                <h1 className='text-20 font-bold leading-30'>Calendar</h1>
                <div className='flex w-auto justify-between'>
                    <div
                        className='flex min-w-40 grow cursor-pointer items-center justify-center'
                        onClick={handlePrevMonth}
                    >
                        <img src='/images/left.png' alt='' className='w-12' />
                    </div>

                    <div className='flex w-100 items-baseline justify-center'>
                        <p className='h-24 text-20 font-bold'>{format(currentDate, 'MMM.')}</p>
                        <p className='text-16'>{format(currentDate, 'yyyy')}</p>
                    </div>
                    <div
                        className='flex min-w-40 grow cursor-pointer items-center justify-center'
                        onClick={handleNextMonth}
                    >
                        <img src='/images/right.png' alt='' className='w-12' />
                    </div>
                </div>
            </div>

            <div className='mt-30 flex w-full border-b-1 border-strong'>
                {DAY_LIST.map((day, index) => (
                    <div key={index} className='flex w-[calc(100%/7)] items-center justify-center'>
                        <p className={index === 0 ? 'text-red' : index === 6 ? 'text-blue' : ''}>{day}</p>
                    </div>
                ))}
            </div>

            <div className='mt-6 flex w-full grow flex-col'>
                {weekCalendarList.map((week, weekIndex) => (
                    <div key={weekIndex} className='flex h-[calc(100%/6)] w-full'>
                        {week.map((day, dayIndex) => (
                            <div
                                key={dayIndex}
                                className='flex w-full cursor-pointer items-center justify-center'
                                onClick={() => handleDateClick(day)}
                            >
                                <p
                                    className={` ${dayIndex === 0 ? 'text-red' : dayIndex === 6 ? 'text-blue' : ''} flex h-48 w-48 cursor-pointer items-center justify-center rounded-full ${getBackgroundColor(completedCounts[format(new Date(currentDate.getFullYear(), currentDate.getMonth(), day), 'yyyy-MM-dd')] || 0)} ${completedCounts[format(new Date(currentDate.getFullYear(), currentDate.getMonth(), day), 'yyyy-MM-dd')] > 0 ? 'text-white' : ''} `}
                                >
                                    {day !== 0 ? day : ''}
                                </p>
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Calendar;
