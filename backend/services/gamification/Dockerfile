# Build stage
FROM golang:1.23-alpine AS builder

WORKDIR /app

# Copy shared module first
COPY services/shared /app/services/shared

# Copy gamification service
COPY services/gamification /app/services/gamification

# Build the gamification service
WORKDIR /app/services/gamification
RUN go mod download
RUN CGO_ENABLED=1 GOOS=linux go build -a -installsuffix cgo -o main .

# Runtime stage
FROM alpine:latest

RUN apk --no-cache add ca-certificates

WORKDIR /root/

# Copy the binary from builder
COPY --from=builder /app/services/gamification/main .

# Expose port
EXPOSE 8086

# Run the binary
CMD ["./main"]
