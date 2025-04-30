import {
  Button,
  CardActions,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  TextField,
  Typography,
} from '@mui/material'
import { useForm } from '@tanstack/react-form'

import { useUser } from '../hooks/use-user'
import { z } from 'zod'
import _ from 'lodash'
import { Link } from 'react-router'
import { Card } from '@mui/material'

const tests = [
  {
    id: 'tst',
    name: 'fractional reserve',
    description: 'test description',
    questions: [
      {
        id: 'testtt',
      },
    ],
  },
  {
    id: 'tstasdf',
    name: 'fractional testst 2',
    description: 'test description',
    questions: [
      {
        id: 'testaatt',
      },
    ],
  },
  {
    id: 'tstasdf',
    name: 'fractional testst 4',
    description: 'test description',
    questions: [
      {
        id: 'testaatt',
      },
    ],
  },
  {
    id: 'tstasdf',
    name: 'fractional testst 6',
    description: 'test description',
    questions: [
      {
        id: 'testaatt',
      },
    ],
  },
]

export default function QuizzesHome() {
  const { user, setUser } = useUser()
  const form = useForm({
    defaultValues: {
      name: user,
    },
    validators: {
      onChange: z.object({
        name: z
          .string({ message: 'Need a name' })
          .min(2, 'Name needs to be at least 2 characters long'),
      }),
    },
    onSubmit: async ({ value }) => {
      setUser(value.name)
    },
  })

  if (!user) {
    return (
      <Dialog open>
        <DialogTitle>Login</DialogTitle>
        <DialogContent>
          <form
            onSubmit={e => {
              e.preventDefault()
              e.stopPropagation()
              form.handleSubmit()
            }}
          >
            <Grid container spacing={2} direction="column">
              <Typography>Please enter your name:</Typography>
              <form.Field
                name="name"
                children={field => (
                  <TextField
                    id={field.name}
                    label={
                      _.isEmpty(field.state.meta.errors)
                        ? 'Name'
                        : field.state.meta.errors
                            .map(e => e?.message)
                            .join(', ')
                    }
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={e => field.handleChange(e.target.value || '')}
                    error={!_.isEmpty(field.state.meta.errors)}
                  />
                )}
              />
            </Grid>
          </form>
        </DialogContent>
        <DialogActions>
          <Button
            id="button-login-form"
            type="button"
            variant="contained"
            onClick={() => form.handleSubmit()}
          >
            Login
          </Button>
        </DialogActions>
      </Dialog>
    )
  }

  return (
    <div>
      <Grid
        container
        direction="row"
        columns={{ xs: 4, sm: 8, md: 12 }}
        spacing={4}
      >
        {_.map(tests, test => (
          <Grid key={test.id} size={4}>
            <Card>
              <CardContent>
                <Typography variant="h4">{test.name}</Typography>
                <Typography variant="body1">{test.description}</Typography>
              </CardContent>
              <CardActions
                sx={{
                  justifyContent: 'center',
                }}
              >
                <Link to={`/question/${test.questions[0].id}`}>
                  <Button>Start Test</Button>
                </Link>
              </CardActions>
            </Card>
          </Grid>
        ))}
        {_.isEmpty(tests) && (
          <Typography variant="h4">No tests available</Typography>
        )}
      </Grid>
    </div>
  )
}
