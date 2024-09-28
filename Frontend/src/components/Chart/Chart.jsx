// import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"
// import { ChartContainer } from "@/components/ui/chart"
// import { ChartTooltip, ChartTooltipContent,  ChartLegend, ChartLegendContent } from "@/components/ui/chart"



// const chartData = [
//   { month: "January", desktop: 186, mobile: 80 },
//   { month: "February", desktop: 305, mobile: 200 },
//   { month: "March", desktop: 237, mobile: 120 },
//   { month: "April", desktop: 73, mobile: 190 },
//   { month: "May", desktop: 209, mobile: 130 },
//   { month: "June", desktop: 214, mobile: 140 },
// ]

// const chartConfig = {
//   desktop: {
//     label: "Desktop",
//     color: "#2563eb",
//   },
//   mobile: {
//     label: "Mobile",
//     color: "#60a5fa",
//   },
// }

// export function ChartDemo() {
//   return (
//     <ChartContainer config={chartConfig} className="h-[500px] w-60">
//       <BarChart accessibilityLayer data={chartData}>
//       <CartesianGrid vertical={false} />
//       <XAxis
//       dataKey="month"
//       tickLine={false}
//       tickMargin={10}
//       axisLine={false}
//       tickFormatter={(value) => value.slice(0, 3)}
//     />
//     <ChartTooltip content={<ChartTooltipContent />} />
//     {/* <ChartLegend content={<ChartLegendContent />} /> */}
//         <Bar dataKey="desktop" fill={chartConfig.desktop.color} radius={4} />
//         <Bar dataKey="mobile" fill={chartConfig.mobile.color} radius={4} />
//       </BarChart>
//     </ChartContainer>
//   )
// }


"use client"

import React, { useState, useMemo } from "react"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

export const description = "An interactive bar chart"

const chartData = [
    { date: "2024-07-01", desktop: 120, mobile: 80 },
    { date: "2024-07-02", desktop: 130, mobile: 90 },
    { date: "2024-07-03", desktop: 150, mobile: 110 },
    { date: "2024-07-04", desktop: 140, mobile: 100 },
    { date: "2024-07-05", desktop: 160, mobile: 120 },
    { date: "2024-07-06", desktop: 180, mobile: 130 },
    { date: "2024-07-07", desktop: 170, mobile: 140 },
    { date: "2024-07-08", desktop: 190, mobile: 150 },
    { date: "2024-07-09", desktop: 200, mobile: 160 },
    { date: "2024-07-10", desktop: 210, mobile: 170 },
    { date: "2024-07-11", desktop: 220, mobile: 180 },
    { date: "2024-07-12", desktop: 230, mobile: 190 },
    { date: "2024-07-13", desktop: 240, mobile: 200 },
    { date: "2024-07-14", desktop: 250, mobile: 210 },
    { date: "2024-07-15", desktop: 260, mobile: 220 },
    { date: "2024-07-16", desktop: 270, mobile: 230 },
    { date: "2024-07-17", desktop: 280, mobile: 240 },
    { date: "2024-07-18", desktop: 290, mobile: 250 },
    { date: "2024-07-19", desktop: 300, mobile: 260 },
    { date: "2024-07-20", desktop: 310, mobile: 270 },
    { date: "2024-07-21", desktop: 320, mobile: 280 },
    { date: "2024-07-22", desktop: 330, mobile: 290 },
    { date: "2024-07-23", desktop: 340, mobile: 300 },
    { date: "2024-07-24", desktop: 350, mobile: 310 },
    { date: "2024-07-25", desktop: 360, mobile: 320 },
    { date: "2024-07-26", desktop: 370, mobile: 330 },
    { date: "2024-07-27", desktop: 380, mobile: 340 },
    { date: "2024-07-28", desktop: 390, mobile: 350 },
    { date: "2024-07-29", desktop: 400, mobile: 360 },
    { date: "2024-07-30", desktop: 410, mobile: 370 },
    { date: "2024-07-31", desktop: 420, mobile: 380 },
  ];
  

const chartConfig = {
  views: {
    label: "Page Views",
  },
  desktop: {
    label: "Desktop",
    color: "hsl(var(--chart-1))",
  },
  mobile: {
    label: "Mobile",
    color: "hsl(var(--chart-2))",
  },
}

export function ChartDemo() {
  const [activeChart, setActiveChart] = useState("desktop")

  const total = useMemo(
    () => ({
      desktop: chartData.reduce((acc, curr) => acc + curr.desktop, 0),
      mobile: chartData.reduce((acc, curr) => acc + curr.mobile, 0),
    }),
    []
  )

  return (
    <Card>
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
          <CardTitle>Bar Chart - Interactive</CardTitle>
          <CardDescription>
            Showing total visitors for the last 3 months
          </CardDescription>
        </div>
        <div className="flex">
          {["desktop", "mobile"].map((key) => {
            return (
              <button
                key={key}
                data-active={activeChart === key}
                className="relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-l sm:border-t-0 sm:px-8 sm:py-6"
                onClick={() => setActiveChart(key)}
              >
                <span className="text-xs text-muted-foreground">
                  {chartConfig[key].label}
                </span>
                <span className="text-lg font-bold leading-none sm:text-3xl">
                  {total[key].toLocaleString()}
                </span>
              </button>
            )
          })}
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <BarChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value)
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              }}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[150px]"
                  nameKey="views"
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })
                  }}
                />
              }
            />
            <Bar dataKey={activeChart} fill={`var(--color-${activeChart})`} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
