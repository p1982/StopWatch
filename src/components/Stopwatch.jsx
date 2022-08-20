import React, { useEffect, useState } from "react";
import { interval, Subject, fromEvent } from "rxjs";
import { takeUntil, debounceTime, buffer, map, filter } from "rxjs/operators";
import { Button } from "./button/Button";
import { Milliseconds } from "./miliseconds/Miliseconds";
import { Seconds } from "./seconds/Seconds";
import { Minutes } from "./minutes/Minutes";
import { Hours } from "./hours/Hours";

export const Stopwatch = () => {
  const [sec, setSec] = useState(0);
  const [status, setStatus] = useState("stop");
  const [startWatch, setStartWatch] = useState(false);

  useEffect(() => {
    const unsubscribe$ = new Subject();
    interval(10)
      .pipe(takeUntil(unsubscribe$))
      .subscribe(() => {
        if (status === "run") {
          setSec((val) => val + 10);
        }
      });
    return () => {
      setStartWatch(!startWatch);
      unsubscribe$.next();
      unsubscribe$.complete();
    };
  }, [status]);

  useEffect(() => {
    const click$ = fromEvent(document.getElementById("wait"), "click");
    const doubleClick$ = click$.pipe(
      buffer(click$.pipe(debounceTime(300))),
      map((clicks) => clicks.length),
      filter((clicksLength) => clicksLength === 2)
    );
    doubleClick$.subscribe((_) => {
      setStatus("wait")
      console.log("double clicked detected", _);
    });
  }, []);

  const startStopWatch = (start) => {
    if (start) {
      setSec(0);
      setStartWatch(!startWatch);
      setStatus("stop");
    } else {
      setStartWatch(!startWatch);
      setStatus("run");
    }
  };

  const resetWatch = () => {
    setSec(0);
    setStatus("run");
    setStartWatch(!startWatch);
  };

  const miliseconds = ("0" + ((sec / 10) % 1000)).slice(-2);
  const seconds = ("0" + Math.floor((sec / 1000) % 60)).slice(-2);
  const minutes = ("0" + Math.floor((sec / 60000) % 60)).slice(-2);
  const hours = ("0" + Math.floor((sec / 6000000) % 60)).slice(-2);

  return (
    <div>
      <h1>Stopwatch</h1>
      <div>
        <Hours text={hours} />
        <Minutes text={minutes} />
        <Seconds text={seconds} />
        <Milliseconds text={miliseconds} />
      </div>
      <Button
        onClick={() => startStopWatch(startWatch)}
        startWatch={startWatch}
        title="start/stop"
      />
      <button id="wait">wait</button>
      <Button onClick={() => resetWatch()} title="reset" />
    </div>
  );
};