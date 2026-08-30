# Build stage
FROM golang:1.25.5-alpine AS builder

RUN apk add --no-cache gcc musl-dev

WORKDIR /app

# Copy shared module first
COPY services/shared /app/services/shared

# Copy certifications service
COPY services/certifications /app/services/certifications

# Build the certifications service
WORKDIR /app/services/certifications
RUN go mod download
RUN CGO_ENABLED=1 GOOS=linux go build -a -installsuffix cgo -o main .

# Runtime stage
FROM alpine:latest

RUN apk --no-cache add ca-certificates

WORKDIR /root/

# Copy the binary from builder
COPY --from=builder /app/services/certifications/main .

# Expose port
EXPOSE 8085

# Run the binary
CMD ["./main"]
