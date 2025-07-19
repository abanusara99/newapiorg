import type { SVGProps } from "react"

export const Icons = {
  logo: (props: SVGProps<SVGSVGElement>) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M14.5 2.5a2.5 2.5 0 0 1 5 0 2.5 2.5 0 0 1-5 0Z"/>
      <path d="m20.25 7.75-2.5 2.5"/>
      <path d="m14.5 11.5-2.5 2.5"/>
      <path d="M9.5 7.5a2.5 2.5 0 0 1 5 0 2.5 2.5 0 0 1-5 0Z"/>
      <path d="M4.5 11.5a2.5 2.5 0 0 1 5 0 2.5 2.5 0 0 1-5 0Z"/>
      <path d="M2.25 18.75 6 15"/>
    </svg>
  ),
}
