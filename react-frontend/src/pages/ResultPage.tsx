import {
  Button,
  Card,
  CardActions,
  CardContent,
  Grid,
  Typography,
} from '@mui/material'

import { Link, useParams } from 'react-router'
import { useUser } from '../hooks/use-user'
import { useQuery } from '@tanstack/react-query'
import _ from 'lodash'

/**
 * Results page
 */
export default function ResultPage() {
  const { id } = useParams()
  const { user } = useUser()
  const query = useQuery({
    enabled: !!user,
    queryKey: ['submissions', id],
    queryFn: async () =>
      (
        await fetch(`${import.meta.env.VITE_API_URL}/submissions/${id}`, {
          method: 'GET',
          headers: {
            'quiz-user': user,
          },
        })
      ).json(),
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
              <Typography>Results Unavailable</Typography>
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

  return (
    <Grid container justifyContent="center">
      <Grid size={8}>
        <Card>
          <CardContent
            sx={{
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <Typography variant="h4">Results</Typography>
            <table>
              <thead>Correct answers</thead>
              <tbody>
                <tr>
                  <td>{query.data.correct_answers}</td>
                </tr>
              </tbody>
            </table>
          </CardContent>
          <CardActions
            sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
            }}
          >
            <Link to="/home">
              <Button>Back to Home</Button>
            </Link>
          </CardActions>
        </Card>
      </Grid>
    </Grid>
  )
}
