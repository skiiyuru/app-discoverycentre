import { toast } from 'sonner'

import getParticipants from '@/features/events/actions/get-participants'
import ExportButton from '@/features/events/components/export-button'

export default async function Page() {
  const data = await getParticipants()

  const isError = data && 'errorMessage' in data
  // const participants = isError ? [] : data

  if (isError) {
    toast.error(data.errorMessage)
    return <p className="text-red-400">Could not retreive the data</p>
  }

  return (
    <div className="grid gap-4 md:max-w-4/5 lg:max-w-2/5 mx-auto">
      <div className="flex justify-between">
        <h2 className="text-2xl font-bold">Registered Participants</h2>

        <ExportButton />
      </div>
      <p className="text-sm text-gray-400">The data table is in development</p>
      {/* <Table className="">
        <TableHeader>
          <TableRow>
            <TableHead className="w-1/3">Name</TableHead>
            <TableHead>Gender</TableHead>
            <TableHead>Age</TableHead>
            <TableHead>Date of Birth</TableHead>
            <TableHead className="">Category</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {participants.map(({ id, firstName, lastName, gender, age, dob, category }) => (
            <TableRow key={id}>
              <TableCell className="font-medium">{`${firstName} ${lastName}`}</TableCell>
              <TableCell>{gender}</TableCell>
              <TableCell>{age}</TableCell>
              <TableCell className="">{dob}</TableCell>
              <TableCell className="">{category}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Pagination className="flex justify-end">
        <PaginationContent>
          <PaginationItem className="">
            <PaginationPrevious href="#" />
          </PaginationItem>
          <PaginationItem>
            <PaginationNext href="#" />
          </PaginationItem>
        </PaginationContent>
      </Pagination> */}
    </div>
  )
}
