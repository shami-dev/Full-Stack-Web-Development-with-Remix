import type { ActionArgs } from '@remix-run/node';
import { redirect } from '@remix-run/node';

import { Button } from '~/components/buttons';
import { Form, Input, Textarea } from '~/components/forms';
import { db } from '~/modules/db.server';

export async function action({ request }: ActionArgs) {
  const formData = await request.formData();
  const title = formData.get('title');
  const description = formData.get('description');
  const amount = formData.get('amount');
  if (typeof title !== 'string' || typeof description !== 'string' || typeof amount !== 'string') {
    throw Error('something went wrong');
  }
  const amountNumber = Number.parseFloat(amount);
  if (Number.isNaN(amountNumber)) {
    throw Error('something went wrong');
  }
  const expense = await db.expense.create({
    data: {
      title,
      description,
      amount: amountNumber,
      currencyCode: 'USD',
    },
  });
  return redirect(`/dashboard/expenses/${expense.id}`);
}

export default function Component() {
  return (
    <Form method="POST" action="/dashboard/expenses/?index">
      <Input label="Title:" type="text" name="title" placeholder="Dinner for Two" required />
      <Textarea label="Description:" name="description" />
      <Input label="Amount (in USD):" type="number" defaultValue={0} name="amount" required />
      <Button type="submit" isPrimary>
        Create
      </Button>
    </Form>
  );
}
