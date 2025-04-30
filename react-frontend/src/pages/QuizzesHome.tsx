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
import { useQuery } from '@tanstack/react-query'
import { z } from 'zod'
import _ from 'lodash'
import { Link } from 'react-router'
import { Card } from '@mui/material'

import { useUser } from '../hooks/use-user'

export default function QuizzesHome() {
  const { user, setUser } = useUser()
  // Queries
  const query = useQuery({
    queryKey: ['quizzes'],
    queryFn: async () =>
      (await fetch(`${import.meta.env.VITE_API_URL}/quizzes`)).json(),
  })
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

  console.log({ user, query, form })

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

  if (query.isLoading) {
    return <div>loading...</div>
  }

  return (
    <div>
      <Grid
        container
        direction="row"
        columns={{ xs: 4, sm: 8, md: 12 }}
        spacing={4}
      >
        {_.map(query.data, quiz => {
          console.log(quiz)
          return (
            <Grid key={quiz.id} size={4}>
              <Card>
                <CardContent>
                  <Typography variant="h4">{quiz.name}</Typography>
                  <Typography variant="body1">{quiz.description}</Typography>
                </CardContent>
                <CardActions
                  sx={{
                    justifyContent: 'center',
                  }}
                >
                  <Link to={`/question/${quiz.questions[0].id}`}>
                    <Button id={`quiz-start-${quiz.id}`}>Start Quiz</Button>
                  </Link>
                </CardActions>
              </Card>
            </Grid>
          )
        })}
        {_.isEmpty(query.data) && (
          <Typography variant="h4">No tests available</Typography>
        )}
      </Grid>
    </div>
  )
}
