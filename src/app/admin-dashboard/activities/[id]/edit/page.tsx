import EditActivityClient from './EditActivityClient';

export default function EditActivityPage({ params }: { params: { id: string } }) {
  return <EditActivityClient id={params.id} />;
}