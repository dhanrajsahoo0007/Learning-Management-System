# Build stage
FROM golang:1.23-alpine AS builder

WORKDIR /app

# Copy shared module first
COPY services/shared /app/services/shared

# Copy system-design service
COPY services/system-design /app/services/system-design

# Build the system-design service
WORKDIR /app/services/system-design
RUN go mod download
RUN CGO_ENABLED=1 GOOS=linux go build -a -installsuffix cgo -o main .

# Runtime stage
FROM alpine:latest

RUN apk --no-cache add ca-certificates

WORKDIR /root/

# Copy the binary from builder
COPY --from=builder /app/services/system-design/main .

# Expose port
EXPOSE 8083

# Run the binary
CMD ["./main"]
