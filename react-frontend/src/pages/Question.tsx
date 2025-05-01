import {
  Button,
  Card,
  CardActions,
  CardContent,
  Grid,
  TextField,
  Typography,
} from '@mui/material'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Link, useNavigate, useParams } from 'react-router'
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { useForm } from '@tanstack/react-form'
import { z } from 'zod'
import _ from 'lodash'
import { useUser } from '../hooks/use-user'

export default function Question() {
  const { id } = useParams()
  const { user } = useUser()
  const query = useQuery({
    queryKey: ['questions', id],
    queryFn: async () =>
      (
        await fetch(`${import.meta.env.VITE_API_URL}/questions/${id}`, {
          method: 'GET',
          headers: {
            'quiz-user': user,
          },
        })
      ).json(),
  })
  const queryClient = useQueryClient()
  const mutation = useMutation({
    mutationFn: async ({ answer }: { answer: string }) =>
      (
        await fetch(`${import.meta.env.VITE_API_URL}/submissions`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'quiz-user': user,
          },
          body: JSON.stringify({ answer, question_id: id }),
        })
      ).json(),
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['questions', id] })
    },
  })
  const nav = useNavigate()
  const form = useForm({
    defaultValues: { answer: '' },
    validators: {
      onChange: z.object({
        answer: z.string({ message: 'You to enter something' }),
      }),
    },
    onSubmit: ({ value, formApi }) => {
      mutation.mutate(value)
      if (formApi.state.submissionAttempts >= 3) {
        formApi.reset()
        if (query.data.next) {
          nav(`/questions/${query.data.next}`)
        } else {
          nav(`/results/${query.data.quiz_id}`)
        }
      }
    },
  })

  if (query.isLoading) {
    return (
      <Grid container justifyContent="center">
        <Grid size={8}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography>loading...</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    )
  }

  if (!user || _.isEmpty(query.data)) {
    return (
      <Grid container justifyContent="center">
        <Grid size={8}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography>Question Unavailable</Typography>
            </CardContent>
            <CardActions>
              <Link to="/home">
                <Button>Back to Home</Button>
              </Link>
            </CardActions>
          </Card>
        </Grid>
      </Grid>
    )
  }

  console.log({ query, form, mutation })

  return (
    <Grid container justifyContent="center">
      <Grid size={8}>
        <form
          onSubmit={e => {
            e.preventDefault()
            e.stopPropagation()
            form.handleSubmit()
          }}
        >
          <Card>
            <CardContent>
              <form.Subscribe
                selector={state => state.submissionAttempts}
                children={submissionAttempts => (
                  <div>
                    <Typography variant="h4">{query.data.title}</Typography>
                    <Typography variant="h6">
                      {submissionAttempts > 0
                        ? `attempts remaining: ${3 - submissionAttempts}`
                        : null}
                    </Typography>
                  </div>
                )}
              ></form.Subscribe>
              <Markdown remarkPlugins={[remarkGfm]}>
                {query.data.description}
              </Markdown>
            </CardContent>
            <CardActions
              sx={{
                justifyContent: 'center',
                paddingTop: '3em',
                paddingBottom: '3em',
              }}
            >
              <form.Field
                name="answer"
                children={field => (
                  <TextField
                    id={field.name}
                    fullWidth
                    label={
                      _.isEmpty(field.state.meta.errors)
                        ? 'Answer'
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
              <Button type="submit" variant="contained">
                Submit
              </Button>
            </CardActions>
          </Card>
        </form>
      </Grid>
    </Grid>
  )
}
