'use client'

import React from 'react'
import Countdown, { CountdownRenderProps } from 'react-countdown'

type Props = {
  date: number
  t: {
    home: {
      hero: {
        bg: string
        sm1: string
        sm2: string
        sm3: string
      }
      day: string
      hour: string
      minute: string
      second: string
    }
  }
}

const CountdownBlock = ({
  value,
  label,
  bgColor,
}: {
  value: number | string
  label: string
  bgColor: string
}) => (
  <div
    className="flex flex-col items-center justify-center w-28 h-40 sm:w-32 sm:h-44 md:w-36 md:h-48 lg:w-40 lg:h-52"
    style={{ backgroundColor: bgColor }}
  >
    <span className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-purple-900">{value}</span>
    <span className="text-xs md:text-sm uppercase font-semibold tracking-widest text-purple-900">
      {label}
    </span>
  </div>
)

const CountdownRenderer = ({
  days,
  hours,
  minutes,
  seconds,
  completed,
  t,
}: CountdownRenderProps & { t: Props['t'] }) => {
  if (completed) {
    return (
      <>
        <span className="hidden lg:inline">{t.home.hero.bg}</span>
        <span className="flex flex-col lg:hidden">
          <span>{t.home.hero.sm1}</span>
          <span>{t.home.hero.sm2}</span>
          <span>{t.home.hero.sm3}</span>
        </span>
      </>
    )
  } else {
    return (
      <div className="flex flex-row gap-1 sm:gap-2 md:gap-4">
        <CountdownBlock value={days} label={t.home.day} bgColor="#edba0e" />
        <CountdownBlock value={hours} label={t.home.hour} bgColor="#c94126" />
        <CountdownBlock value={minutes} label={t.home.minute} bgColor="#866df7" />
        {/*<CountdownBlock value={seconds} label={t.home.second} bgColor="#ff6fb5" />*/}
      </div>
    )
  }
}

export default function CountdownComponent({ date, t }: Props) {
  return <Countdown date={date} renderer={props => CountdownRenderer({ ...props, t })} />
}
