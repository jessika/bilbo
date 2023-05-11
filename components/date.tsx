import { parseISO, format } from 'date-fns'

export default function Date({
   dateString,
   formatString = 'LLLL d, yyyy',
}: {
   dateString: string,
   formatString?: string,
}) {
  const date = parseISO(dateString)
  return <time dateTime={dateString}>{format(date, formatString)}</time>
}
