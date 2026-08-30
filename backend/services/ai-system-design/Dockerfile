# Build stage
FROM golang:1.25.5-alpine AS builder

RUN apk add --no-cache gcc musl-dev

WORKDIR /app

# Copy shared module first
COPY services/shared /app/services/shared

# Copy ai-system-design service
COPY services/ai-system-design /app/services/ai-system-design

# Build the ai-system-design service
WORKDIR /app/services/ai-system-design
RUN go mod download
RUN CGO_ENABLED=1 GOOS=linux go build -a -installsuffix cgo -o main .

# Runtime stage
FROM alpine:latest

RUN apk --no-cache add ca-certificates

WORKDIR /root/

# Copy the binary from builder
COPY --from=builder /app/services/ai-system-design/main .

# Expose port
EXPOSE 8084

# Run the binary
CMD ["./main"]
